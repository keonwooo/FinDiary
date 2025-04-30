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
     * multiSelectEvent : Multi Select 이벤트 등록
     * inputSelector    : input tag selector 명
     * displayId        : 보여지는 id 명
     * nonSelectedText  : 선택 하지 않았을 때 보여줄 text
     ********************************************************************************/
    multiSelectEvent: function (inputSelector, displayId, nonSelectedText) {
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
    getMultiSelected: function(inputSelector) {
        const checkboxes = document.querySelectorAll(inputSelector);

        return Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
    },
    movePageFnc: function (page) {

        kwfw.ajax()
    }
}