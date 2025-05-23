jQuery(document).ready(function () {
    try {
        if (typeof onloadpage === "function") {
            onloadpage();
        }
    } catch (e) {
        console.log("onloadpage error=", e);
    } finally {
        const pathName = this.location.pathname.replace("/", '');
        if (pathName !== "") {
            _$("." + pathName).addClass("active");
        }
    }
});

const FinDiary = {
    popup: {
        openNotificationModal: function (contentJson) {
            _$("#notification-popup .modal-title").html(contentJson.titleTxt);
            _$("#notification-popup .modal-body").html(contentJson.bodyTxt);

            if (contentJson.confirmFlag) {
                _$("#notification-popup .btn-primary").html(contentJson.confirmBtnTxt);
                _$("#notification-popup .btn-primary").show();

                if (typeof contentJson.confirmBtnFnc === "function") {
                    _$("#notification-popup .btn-primary").unbind("click");
                    _$("#notification-popup .btn-primary").on("click", function () {
                        contentJson.confirmBtnFnc();
                    });
                }
            } else {
                _$("#notification-popup .btn-primary").hide();
            }

            if (contentJson.dangerFlag) {
                _$("#notification-popup .btn-danger").html(contentJson.dangerBtnTxt);
                _$("#notification-popup .btn-danger").show();

                if (typeof contentJson.dangerBtnFnc === "function") {
                    _$("#notification-popup .btn-danger").unbind("click");
                    _$("#notification-popup .btn-danger").on("click", function () {
                        contentJson.dangerBtnFnc();
                    });
                }
            } else {
                _$("#notification-popup .btn-danger").hide();
            }

            _$("#notification-popup").addClass("modal-active");
        },
    },
    /********************************************************************************
     * eventMultiSelectBox : Multi Select 이벤트 등록
     * inputSelector    : input tag selector 명
     * displayId        : 보여지는 id 명
     * nonSelectedText  : 선택 하지 않았을 때 보여줄 text
     ********************************************************************************/
    eventMultiSelectBox: function (inputSelector, displayId, nonSelectedText) {
        const checkboxes = document.querySelectorAll(inputSelector);
        const display = document.getElementById(displayId);

        checkboxes.checked = 'checked';

        function updateSelectedAccounts() {
            const selected = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => {
                    return {
                        "label": cb.dataset.label,
                        "value" : cb.value
                    };
                });

            if (selected.length === 0) {
                display.textContent = nonSelectedText;
                display.title = '';
            } else {
                const joined = selected.map(item => item.label).join(', ');
                display.textContent = joined;
                display.title = joined;
            }
        }

        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => updateSelectedAccounts());
        });

        updateSelectedAccounts(); // 초기 상태 반영
    },

    /********************************************************************************
     * getMultiSelected : Multi Select check된 값 get
     * inputSelector    : input tag selector 명
     ********************************************************************************/
    getMultiSelected: function(inputSelector) {
        const checkboxes = document.querySelectorAll(inputSelector);

        return Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
    },

    /********************************************************************************
     * renderSelectBox  : Select 이벤트 등록
     * selectorId    : input tag selector id
     * contents         : 등록할 contents (JSON or Array)
     ********************************************************************************/
    renderSelectBox: function(selectorId, contents = []) {
        const container = document.getElementById(selectorId);
        if (!container) return;

        // 기존 내용 초기화
        container.innerHTML = '';

        // select 요소 생성
        const selectEl = document.createElement('select');
        selectEl.className = 'w70p';
        selectEl.id = 'add-trading-selected-bankaccount';

        // 옵션 동적으로 추가
        contents.forEach(content => {
            const optionEl = document.createElement('option');
            optionEl.value = content.value;
            optionEl.textContent = content.textContent;
            // optionEl.textContent = `${content.value} [${content.label}]`;
            selectEl.appendChild(optionEl);
        });

        container.appendChild(selectEl);
    },

    /********************************************************************************
     * getNumberAndName : number와 name을 `[number] name` 으로 반환
     * number           : number
     * name             : name
     ********************************************************************************/
    getNumberAndName: function (number, name) {
        return "[" + number + "] " + name;
    },

    /********************************************************************************
     * resetRadio       : radio 태그의 값을 초기화
     * name             : radio name
     * defaultIndex     : 초기화 값
     ********************************************************************************/
    resetRadio: function (name, defaultIndex = 0) {
        const radios = document.querySelectorAll(`input[name="${name}"]`);
        radios.forEach((radio, index) => {
            radio.checked = (index === defaultIndex);
        });
    },

    /********************************************************************************
     * getUSMarketStatus    : 미국장 상태 반환
     * return               : 'closed', 'premarket', 'regular', 'aftermarket'
     ********************************************************************************/
    getUSMarketStatus: function (now = new Date()) {
        const day = now.getUTCDay(); // UTC 기준으로 요일
        if (day === 0 || day === 6) return 'closed'; // 일요일(0), 토요일(6)

        const dst = FinDiary.isDST(now); // DST 여부 판단
        const offset = dst ? -4 : -5; // UTC 기준 EST: -5, EDT: -4

        const utcHour = now.getUTCHours();
        const utcMin = now.getUTCMinutes();
        const estHour = utcHour + offset;
        const totalMinutes = estHour * 60 + utcMin;

        // 시간 기준 (현지 시간)
        const preMarketStart = 4 * 60;      // 04:00
        const regularMarketStart = 9 * 60 + 30; // 09:30
        const regularMarketEnd = 16 * 60;   // 16:00
        const afterMarketEnd = 20 * 60;     // 20:00

        if (totalMinutes >= preMarketStart && totalMinutes < regularMarketStart) {
            return 'premarket';
        } else if (totalMinutes >= regularMarketStart && totalMinutes < regularMarketEnd) {
            return 'regular';
        } else if (totalMinutes >= regularMarketEnd && totalMinutes < afterMarketEnd) {
            return 'aftermarket';
        } else {
            return 'closed';
        }
    },

    /********************************************************************************
     * getKoreaMarketStatus : 한국장 상태 반환
     * return               : 'open' or 'closed'
     ********************************************************************************/
    getKoreaMarketStatus: function(now = new Date()) {
        const day = now.getDay();
        if (day === 0 || day === 6) return 'closed'; // 주말

        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        return (totalMinutes >= 540 && totalMinutes <= 930) ? 'open' : 'closed'; // 09:00 ~ 15:30
    },

    /********************************************************************************
     * isDST    : 미국장 서머타임 계산용
     ********************************************************************************/
    isDST(date = new Date()) {
        const year = date.getFullYear();
        const march = new Date(year, 2, 1);
        const marchDay = march.getDay();
        const secondSundayInMarch = 14 - marchDay;
        const november = new Date(year, 10, 1);
        const novemberDay = november.getDay();
        const firstSundayInNovember = 1 + (7 - novemberDay) % 7;
        const dstStart = new Date(year, 2, secondSundayInMarch, 2);
        const dstEnd = new Date(year, 10, firstSundayInNovember, 2);
        return date >= dstStart && date < dstEnd;
    },
}