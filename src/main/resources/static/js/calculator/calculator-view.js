/********************************************************************************
 * @classDescription 주가 계산기 js
 * @author kw
 * @version 1.0
 * -------------------------------------------------------------------------------
 * Modification Information
 * Date              Developer           Content
 * ----------        -------------       -------------------------
 * 2025/06/19        김건우               신규생성
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
    CalculatorView.definePage();
    //이벤트 정의
    CalculatorView.defineEvent();
    //초기 데이터 로딩
    CalculatorView.initDataLoading();
}

/********************************************************************************
 * Page Object
 ********************************************************************************/
const CalculatorView = {
    /********************************************************************************
     * Variable Object : 페이지 내 전역 Object
     ********************************************************************************/
    name: "CalculatorView",

    /********************************************************************************
     * Define Page Object (UI 랜더링)
     ********************************************************************************/
    definePage: function () {
        console.log(`${this.name} definePage ::::: `);
    },


    /********************************************************************************
     * Define Event Object (이벤트 바인딩, 클릭, 변경, 입력 등)
     ********************************************************************************/
    defineEvent: function () {
        console.log(`${this.name} defineEvent ::::: `);

        $("#username").on({
            keydown: function (e) {
                if (e.keyCode === 13) {
                    $("#password").focus();
                }
            },
            focusout: function (e) {
                $("#username").val($("#username").val().toUpperCase());
            }
        });
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

    /********************************************************************************
     * 예상 등락율 계산기
     ********************************************************************************/
    calculateReturnRate: function () {
        const current = parseFloat(document.getElementById('currentPrice').value);
        const expected = parseFloat(document.getElementById('expectedPrice').value);
        if (current && expected) {
            const rate = ((expected - current) / current * 100).toFixed(2);
            document.getElementById('returnRateResult').innerText = `등락율: ${rate}%`;
            CalculatorView.logItem('returnRateLog', `현재가 ${current} → 예상가 ${expected} → ${rate}%`);
        }
    },

    /********************************************************************************
     * 목표 수익률 도달 예상가
     ********************************************************************************/
    calculateTargetPrice: function () {
        const buy = parseFloat(document.getElementById('buyPrice').value);
        const rate = parseFloat(document.getElementById('targetRate').value);
        if (buy && rate) {
            const price = (buy * (1 + rate / 100)).toFixed(2);
            document.getElementById('targetPriceResult').innerText = `목표가: ${price}원`;
            CalculatorView.logItem('targetPriceLog', `매수가 ${buy} + ${rate}% → 목표가 ${price}원`);
        }
    },

    /********************************************************************************
     * 평단가 계산기
     ********************************************************************************/
    calculateAvgPrice: function () {
        const p1 = parseFloat(document.getElementById('firstPrice').value);
        const q1 = parseInt(document.getElementById('firstQty').value);
        const p2 = parseFloat(document.getElementById('secondPrice').value);
        const q2 = parseInt(document.getElementById('secondQty').value);
        if (p1 && q1 && p2 && q2) {
            const avg = ((p1 * q1 + p2 * q2) / (q1 + q2)).toFixed(2);
            document.getElementById('avgPriceResult').innerText = `평단가: ${avg}원`;
            CalculatorView.logItem('avgPriceLog', `(${p1}×${q1} + ${p2}×${q2}) / ${q1 + q2} = ${avg}원`);
        }
    },

    /********************************************************************************
     * 예상 배당금 계산기
     ********************************************************************************/
    calculateDividend: function () {
        const count = parseInt(document.getElementById('stockCount').value);
        const perShare = parseFloat(document.getElementById('dividendPerShare').value);
        if (count && perShare) {
            const gross = (count * perShare).toFixed(2);
            const net = (gross * (1 - 0.154)).toFixed(2);
            document.getElementById('dividendResult').innerText = `세전 ${gross}원 / 세후 ${net}원`;
            CalculatorView.logItem('dividendLog', `보유 ${count}주 × ${perShare}원 → 세전 ${gross}, 세후 ${net}`);
        }
    },

    logItem: function (logId, text) {
        const ul = document.getElementById(logId);
        const li = document.createElement('li');
        li.textContent = text;
        ul.prepend(li);
    },

    /********************************************************************************
     * GO_PAGE Object : 페이지 이동
     ********************************************************************************/
    goPage: function (url) {
    },

    /********************************************************************************
     * Popup Object : 팝업
     ********************************************************************************/
    popup: function () {
    },

    /********************************************************************************
     * User Object : 사용자 정의 함수 정의
     ********************************************************************************/
    userCustom: function () {
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
var PublicCalculatorView = {
    name: "PublicCalculatorView",
    selects: CalculatorView.selects
};
