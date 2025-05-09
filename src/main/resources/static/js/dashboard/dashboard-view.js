/********************************************************************************
 * @classDescription 대시보드 페이지 js
 * @author kw
 * @version 1.0
 * -------------------------------------------------------------------------------
 * Modification Information
 * Date              Developer           Content
 * ----------        -------------       -------------------------
 * 2025/05/08        김건우               신규생성
 * -------------------------------------------------------------------------------
 *********************************************************************************/
"use strict";
/********************************************************************************
 * Global Variable : 전역변수
 ********************************************************************************/

/********************************************************************************
 * Page Load : After DOM Ready
 ********************************************************************************/
function onloadpage() {
    //페이지 정의
    DashboardView.definePage();
    //이벤트 정의
    DashboardView.defineEvent();
    //초기 데이터 로딩
    DashboardView.initDataLoading();
}

/********************************************************************************
 * Page Object
 ********************************************************************************/
const DashboardView = {
    /********************************************************************************
     * Variable Object : 페이지 내 전역 Object
     ********************************************************************************/
    name: "DashboardView",

    /********************************************************************************
     * Define Page Object (UI 랜더링)
     ********************************************************************************/
    definePage: function () {
        console.log(`${this.name} definePage ::::: `);

        DashboardView.renderWorldClock();

        DashboardView.getQuotes();
    },

    /********************************************************************************
     * Define Event Object (이벤트 바인딩, 클릭, 변경, 입력 등)
     ********************************************************************************/
    defineEvent: function () {
        console.log(`${this.name} defineEvent ::::: `);
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
    //-------------------------------------------------------------------------------
    // renderWorldClock: 세계 시간 rendering
    //-------------------------------------------------------------------------------
    renderWorldClock: function () {
        const now = new Date();

        const formatOptions = {
            timeZone: '',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hourCycle: 'h23' // 24시간제
        };

        // 한국 시간
        formatOptions.timeZone = 'Asia/Seoul';
        const koreaTime = new Intl.DateTimeFormat('en-GB', formatOptions).format(now);

        // 미국 (뉴욕) 시간
        formatOptions.timeZone = 'America/New_York';
        const usaTime = new Intl.DateTimeFormat('en-GB', formatOptions).format(now);

        document.getElementById('korea-time').textContent = koreaTime;
        document.getElementById('usa-time').textContent = usaTime;

        // 다음 초에 맞춰 갱신
        const delay = 1000 - now.getMilliseconds();
        setTimeout(DashboardView.renderWorldClock, delay);
    },

    getQuotes: function() {
        const response = DashboardApi.getQuotes();
        const quotes = response.responseJSON[0];

        document.getElementById('quotes-ko').textContent = quotes.language_ko;
        document.getElementById('author-ko').textContent ='– By.' + quotes.author_ko;
        document.getElementById('quotes-en').textContent = quotes.language_en;
        document.getElementById('author-en').textContent ='– By.' + quotes.author_en;

    },

    //-------------------------------------------------------------------------------
    // ETC: 기타 함수 정의
    //-------------------------------------------------------------------------------
    etc: function (ch) {
    },

};


/********************************************************************************
 * Page Public Object (외부접근용)
 ********************************************************************************/
var PublicDashboardView = {
    name: "PublicDashboardView",
    selects: DashboardView.selects
};

