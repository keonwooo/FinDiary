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
    /********************************************************************************
     * eventMultiSelectBox : Multi Select 이벤트 등록
     * inputSelector    : input tag selector 명
     * displayId        : 보여지는 id 명
     * nonSelectedText  : 선택 하지 않았을 때 보여줄 text
     ********************************************************************************/
    eventMultiSelectBox: function (inputSelector, displayId, nonSelectedText) {
        const checkboxes = document.querySelectorAll(inputSelector);
        const display = document.getElementById(displayId);

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

}