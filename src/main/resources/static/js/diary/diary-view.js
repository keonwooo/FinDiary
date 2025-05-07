/********************************************************************************
 * @classDescription diary 페이지 js
 * @author kw
 * @version 1.0
 * -------------------------------------------------------------------------------
 * Modification Information
 * Date              Developer           Content
 * ----------        -------------       -------------------------
 * 2025/04/24        김건우               신규생성
 * -------------------------------------------------------------------------------
 *********************************************************************************/
"use strict";
/********************************************************************************
 * Global Variable : 전역변수
 ********************************************************************************/
const gCONST_SAMPE = '';  //const 샘플임(가능하면 언더스코어)
const gConstSampe = '';   //이거도 허용함 (상황에 맞게 사용할 것)
let gSampleLet;           //let 샘플임

/********************************************************************************
 * Page Load : After DOM Ready
 ********************************************************************************/
function onloadpage() {
    //페이지 정의
    DiaryView.definePage();
    //이벤트 정의
    DiaryView.defineEvent();
    //초기 데이터 로딩
    DiaryView.initDataLoading();
}

/********************************************************************************
 * Page Object
 ********************************************************************************/
const DiaryView = {
    /********************************************************************************
     * Variable Object : 페이지 내 전역 Object
     ********************************************************************************/
    name: "DiaryView",

    /********************************************************************************
     * Define Page Object (UI 랜더링)
     ********************************************************************************/
    definePage: function () {
        console.log(`${this.name} definePage ::::: `);

        // get 캘린더 정보
        KW_FullCalendar.getCalendar();
    },

    /********************************************************************************
     * Define Event Object (이벤트 바인딩, 클릭, 변경, 입력 등)
     ********************************************************************************/
    defineEvent: function () {
        console.log(`${this.name} defineEvent ::::: `);

        this.getSearchInfo();
    },

    /********************************************************************************
     * Init Data Loading Object (최초 진입 시 백엔드로부터 데이터 받아와 UI 반영)
     ********************************************************************************/
    initDataLoading: function () {
        console.log(`${this.name} initDataLoading ::::: `);
    },

    /********************************************************************************
     * Main Function Object
     ********************************************************************************/

    getSearchInfo: function () {
        console.log(`${this.name} getSearchInfo ::::`);

        // 국가별 공휴일 조회 select event
        FinDiary.eventMultiSelectBox(
            '.search-country-checkbox'
            , 'display-selectedCountry'
            , '국가 선택'
        );

        // 계좌 조회 select event
        FinDiary.eventMultiSelectBox(
            '.search-account-checkbox'
            , 'display-selectedAccounts'
            , '계좌 선택'
        );
    },

    /********************************************************************************
     * User Object : 사용자 정의 함수 정의
     ********************************************************************************/
    setting: {
        addDiary: function (event) {
            _$("#add-trading-popup .modal-title").html("매매 기록 추가");

            // 팝업 초기화
            DiaryView.reset.addDiary();

            // 계좌 select box rendering
            const userBankAccountNumList = DiaryApi.getUserBankAccountNumList();
            const renderSelectBox = userBankAccountNumList.responseJSON
                .map(cb => {
                    return {
                        "value": cb.account_num,
                        "textContent": FinDiary.getNumberAndName(cb.account_num, cb.account_name)
                    }
                });
            FinDiary.renderSelectBox('add-trading-bankaccount', renderSelectBox);

            // set 매매 일자
            _$("#add-trading-date").val(kwfw.date.formatDateToYMD(event.date));
            _$("#add-trading-selecteddate").val(event.date.toISOString());

            // set 삭제 버튼
            _$("#add-trading-delete-btn").hide();

            // set 초기화 버튼
            _$("#add-trading-reset-btn").unbind("click");
            _$("#add-trading-reset-btn").on("click", function () {
                DiaryView.reset.addDiary();
            });

            // set 등록 버튼
            _$('#add-trading-btn').text('등록');
            _$("#add-trading-btn").unbind("click");
            _$("#add-trading-btn").on("click", function () {
                DiaryView.addDiary();
            });

            // 매매 기록 추가 popup open
            _$("#add-trading-popup").addClass("modal-active");
        },

        editDiary: function (event) {
            _$("#add-trading-popup .modal-title").html("매매 기록 수정");

            _$("#edit-trading-selectedinfo").val(JSON.stringify(event));

            DiaryView.reset.editDiary();

            // 계좌 select box rendering
            let userBankAccountNum = DiaryApi.getUserBankAccountNum(event);
            userBankAccountNum = userBankAccountNum.responseJSON;
            const renderSelectBox = [{
                "value": userBankAccountNum.account_num,
                "textContent": FinDiary.getNumberAndName(userBankAccountNum.account_num, userBankAccountNum.account_name)
            }];

            FinDiary.renderSelectBox('add-trading-bankaccount', renderSelectBox);
            const container = document.getElementById('add-trading-bankaccount');
            const selectBox = container.querySelector('select');
            selectBox.disabled = true;

            // 종목 명
            _$("#add-trading-ticker").val(event.ticker);
            _$("#add-trading-ticker").prop('readonly', true);

            // set 삭제 버튼
            _$("#add-trading-delete-btn").show();
            _$("#add-trading-delete-btn").unbind('click');
            _$("#add-trading-delete-btn").on("click", function () {
                DiaryView.deleteDiary();
            });

            // set 초기화 버튼
            _$("#add-trading-reset-btn").unbind('click');
            _$("#add-trading-reset-btn").on("click", function () {
                DiaryView.reset.editDiary();
            });

            // set 수정 버튼
            _$('#add-trading-btn').text('수정');
            _$("#add-trading-btn").unbind("click");
            _$("#add-trading-btn").on("click", function () {
                DiaryView.editDiary();
            });

            _$("#add-trading-popup").addClass("modal-active");
        }
    },

    reset: {
        addDiary: function () {
            document.querySelectorAll('.select').selectedIndex = 0;

            _$("#add-trading-ticker").val("");
            _$("#add-trading-ticker").prop('readonly', false);

            const selectedDate = _$("#add-trading-selecteddate").val() ? new Date(_$("#add-trading-selecteddate").val()) : new Date();
            _$("#add-trading-date").val(kwfw.date.formatDateToYMD(selectedDate));

            FinDiary.resetRadio('add-trading-orderMethod');

            _$("#add-trading-contractPrice").val("");
            _$("#add-trading-count").val("");

            DiaryView.reset.addWarningMsg();
        },

        addWarningMsg: function () {
            _$("#add-trading-ticker-error").hide();
            _$("#add-trading-contractPrice-error").hide();
            _$("#add-trading-count-error").hide();
        },

        editDiary: function () {
            const selectedInfo = JSON.parse(_$("#edit-trading-selectedinfo").val());

            // set 매매 일자
            const selectedDate = kwfw.date.formatStrToDate(selectedInfo.trading_date);
            _$("#add-trading-date").val(kwfw.date.formatDateToYMD(selectedDate));
            _$("#add-trading-selecteddate").val(selectedDate.toISOString());

            // set 주문 방식
            const orderMethods = document.querySelectorAll(`input[name="add-trading-orderMethod"]`);
            orderMethods.forEach((radio) => {
                radio.checked = (radio.value === selectedInfo.trading_type);
            });

            // set 체결 단가
            _$("#add-trading-contractPrice").val(selectedInfo.trading_price);
            _$("#add-trading-selected-property").val(selectedInfo.currency);

            // set 수량
            _$("#add-trading-count").val(selectedInfo.trading_count);

            DiaryView.reset.addWarningMsg();
        },
    },

    checkValid: {
        addDiary: function () {
            let flag = true;
            DiaryView.reset.addWarningMsg();

            const ticker = _$("#add-trading-ticker").val()?.trim();
            if (!ticker && ticker.length === 0) {
                flag = false;
                wrongDivAnimation("#add-trading-ticker");
                _$("#add-trading-ticker-error").show();
            }

            const price = _$("#add-trading-contractPrice").val()?.trim();
            if (!price && price.length === 0) {
                flag = false;
                wrongDivAnimation("#add-trading-contractPrice");
                _$("#add-trading-contractPrice-error").show();
            }

            const count = _$("#add-trading-count").val()?.trim();
            if (!count && count.length === 0) {
                flag = false;
                wrongDivAnimation("#add-trading-count");
                _$("#add-trading-count-error").show();
            }

            return flag;
        },
    },

    getDiaryData: function () {
        const tradingNum = _$("#edit-trading-selectedinfo").val() ? JSON.parse(_$("#edit-trading-selectedinfo").val()).trading_num : "";
        const bankAccount = _$("#add-trading-selected-bankaccount").val()?.trim();
        const ticker = _$("#add-trading-ticker").val()?.trim();
        const date = _$("#add-trading-date").val()?.trim().replaceAll('/', '');
        const orderMethod = $('input[name="add-trading-orderMethod"]:checked').val();
        const price = _$("#add-trading-contractPrice").val()?.trim();
        const property = _$("#add-trading-selected-property").val();
        const count = _$("#add-trading-count").val()?.trim();

        return {
            "trading_num": tradingNum
            , "account_num": bankAccount
            , "ticker": ticker
            , "trading_date": date
            , "trading_type": orderMethod
            , "trading_price": price
            , "currency": property
            , "trading_count": count
        }
    },

    addDiary: function () {
        if (DiaryView.checkValid.addDiary()) {
            const data = DiaryView.getDiaryData();

            const flag = DiaryApi.insertTradingDiary(data);
            if (flag.responseJSON) {
                _$("#add-trading-popup").removeClass("modal-active");
            } else {
                const contentJson = {
                    "titleTxt": "실패",
                    "bodyTxt": "매매 기록 추가에 실패하였습니다.",
                    "confirmFlag": false,
                    "dangerFlag": false
                }
                FinDiary.popup.openNotificationModal(contentJson);
            }
        }

        KW_FullCalendar.renderCalendarEvents();
    },

    editDiary: function () {
        if (DiaryView.checkValid.addDiary()) {
            const data = DiaryView.getDiaryData();

            const flag = DiaryApi.updateTradingDiary(data);
            if (flag.responseJSON) {
                _$("#add-trading-popup").removeClass("modal-active");
            } else {
                const contentJson = {
                    "titleTxt": "실패",
                    "bodyTxt": "매매 기록 추가에 실패하였습니다.",
                    "confirmFlag": false,
                    "dangerFlag": false
                }
                FinDiary.popup.openNotificationModal(contentJson);
            }

            KW_FullCalendar.renderCalendarEvents();
        }
    },

    deleteDiary: function () {
        const contentJson = {
            "titleTxt": "매매 기록 삭제",
            "bodyTxt": "매매 기록을 삭제하시겠습니까?",
            "confirmFlag": false,
            "dangerFlag": true,
            "dangerBtnTxt": "삭제",
            "dangerBtnFnc": function () {
                const data = DiaryView.getDiaryData();

                console.log(data);
                const flag = DiaryApi.deleteTradingDiary(data);
                if (flag.responseJSON) {
                    _$("#add-trading-popup").removeClass("modal-active");
                } else {
                    _$("#notification-popup .modal-title").text('실패');
                    _$("#notification-popup .modal-body").text('매매 기록 삭제에 실패하였습니다.');
                    _$("#notification-popup .btn-danger").hide();

                    _$("#notification-popup").addClass("modal-active");
                }

                KW_FullCalendar.renderCalendarEvents();
            }
        };
        FinDiary.popup.openNotificationModal(contentJson);
    },

    /********************************************************************************
     * Dummay Object : 더미
     ********************************************************************************/
    endPage: function () {

    }
};


/********************************************************************************
 * Page Public Object (외부접근용)
 ********************************************************************************/
var PublicDiaryView = {
    name: "PublicDiaryView",
    selects: DiaryView.selects
};