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
    settingAddDiary: function (event) {
        // 팝업 초기화
        this.resetAddDiary();

        // 계좌 select box rendering
        const userBankAccountNumList = DiaryApi.getUserBankAccountNum();
        const renderSelectBox = userBankAccountNumList.responseJSON
            .map(cb => {
                return {
                    "value": cb.account_num,
                    "textContent": FinDiary.getNumberAndName(cb.account_num, cb.account_name)
                }
            })
        ;
        FinDiary.renderSelectBox('add-trading-bankaccount', renderSelectBox);

        // set 매매 일자
        _$("#add-trading-date").val(kwfw.formatDateToYMD(event.date));
        _$("#add-trading-selecteddate").val(event.date.toISOString());

        // 매매 기록 추가 popup open
        _$("#add-trading-popup").addClass("modal-active");
    },

    resetAddDiary: function () {
        document.querySelectorAll('.select').selectedIndex = 0;

        _$("#add-trading-ticker").val("");

        const selectedDate = _$("#add-trading-selecteddate").val() ? new Date(_$("#add-trading-selecteddate").val()) : new Date();
        _$("#add-trading-date").val(kwfw.formatDateToYMD(selectedDate));

        FinDiary.resetRadio('add-trading-orderMethod');

        _$("#add-trading-contractPrice").val("");
        _$("#add-trading-count").val("");

        this.resetAddWarningMsg();
    },

    resetAddWarningMsg: function () {
        _$("#add-trading-ticker-error").hide();
        _$("#add-trading-contractPrice-error").hide();
        _$("#add-trading-count-error").hide();
    },

    addDiary: function () {
        if (this.diaryValidationCheck()) {
            const bankAccount = _$("#add-trading-selected-bankaccount").val()?.trim();
            const ticker = _$("#add-trading-ticker").val()?.trim();
            const date = _$("#add-trading-date").val()?.trim().replaceAll('/', '');
            const orderMethod = $('input[name="add-trading-orderMethod"]:checked').val();
            const price = _$("#add-trading-contractPrice").val()?.trim();
            const property = _$("#add-trading-selected-property").val();
            const count = _$("#add-trading-count").val()?.trim();

            const data = {
                "account_num": bankAccount
                , "ticker": ticker
                , "trading_date": date
                , "trading_type": orderMethod
                , "trading_price": price
                , "currency": property
                , "trading_count": count
            }

            const flag = DiaryApi.insertTradingDiary(data);
            if (flag.responseJSON) {
                _$("#add-trading-popup").removeClass("modal-active");
            } else {
                _$("#notification-popup").addClass("modal-active");
            }
        }
    },

    diaryValidationCheck: function () {
        let flag = true;
        this.resetAddWarningMsg();

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