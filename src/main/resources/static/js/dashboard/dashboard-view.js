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

        DashboardView.renderShareholding();

        DashboardView.renderFearAndGreed();
    },

    /********************************************************************************
     * Define Event Object (이벤트 바인딩, 클릭, 변경, 입력 등)
     ********************************************************************************/
    defineEvent: function () {
        console.log(`${this.name} defineEvent ::::: `);

        // Fear And Greed Index 업데이트 + 리사이즈 대응
        window.addEventListener("load", DashboardView.renderFearAndGreed);
        window.addEventListener("resize", DashboardView.renderFearAndGreed);
    },

    /********************************************************************************
     * Init Data Loading Object (최초 진입 시 백엔드로부터 데이터 받아와 UI 반영)
     ********************************************************************************/
    initDataLoading: function () {
        console.log(`${this.name} initDataLoading ::::: `);

        DashboardView.getQuotes();
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

        const usMarketStatus = FinDiary.getUSMarketStatus();
        const krMarketStatus = FinDiary.getKoreaMarketStatus();

        // 미국장 open 시 red
        if (usMarketStatus === 'closed') {
            document.getElementById('usa-time').style.color = 'black';
            document.getElementById('usa-time').style.opacity = '0.3';
        } else if (usMarketStatus === 'premarket' || usMarketStatus === 'aftermarket') {
            document.getElementById('usa-time').style.color = 'blue';
            document.getElementById('usa-time').style.opacity = '1';
        } else {
            document.getElementById('usa-time').style.color = 'red';
            document.getElementById('usa-time').style.opacity = '1';
        }

        // 한국장 open 시 red
        if (krMarketStatus === 'closed') {
            document.getElementById('korea-time').style.color = 'black';
            document.getElementById('korea-time').style.opacity = '0.3';
        } else {
            document.getElementById('korea-time').style.color = 'red';
            document.getElementById('korea-time').style.opacity = '1';
        }

        document.getElementById('korea-time').textContent = koreaTime;
        document.getElementById('usa-time').textContent = usaTime;

        // 다음 초에 맞춰 갱신
        const delay = 1000 - now.getMilliseconds();
        setTimeout(DashboardView.renderWorldClock, delay);
    },

    //-------------------------------------------------------------------------------
    // getQuotes: 명언 rendering
    //-------------------------------------------------------------------------------
    getQuotes: function () {
        const response = DashboardApi.getQuotes();
        const quotes = response.responseJSON[0];

        document.getElementById('quotes-ko').textContent = quotes.language_ko;
        document.getElementById('author-ko').textContent = '– By.' + quotes.author_ko;
        document.getElementById('quotes-en').textContent = quotes.language_en;
        document.getElementById('author-en').textContent = '– By.' + quotes.author_en;
    },

    //-------------------------------------------------------------------------------
    // renderShareholding: 보유 현황 rendering
    //-------------------------------------------------------------------------------
    renderShareholding: function () {
        // TODO get 보유 현황
        // DashboardApi.getShareholding();
        const labels = ['Red', 'Blue', 'Yellow'];

        // 동적으로 색상 생성
        const backgroundColors = generateColors(labels.length);

        renderChart(
            'chart-pie-shareholding',       // canvas id
            'pie',           // chart type
            labels, // labels
            [{
                label: 'Votes',
                data: [12, 19, 3],
                backgroundColor: backgroundColors
            }],
            {
                responsive: true,               // 반응형
                maintainAspectRatio: false,    // div에 맞춤
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: false,
                        // text: 'Color Votes Chart',
                    }
                }
            }
        );
    },

    //-------------------------------------------------------------------------------
    // renderFearAndGreed: Fear And Greed Index 차트
    //-------------------------------------------------------------------------------
    renderFearAndGreed: function () {
        const response = DashboardApi.getFearGreedIndex();
        const fgValue = response.responseJSON.currentValue; // Thymeleaf 바인딩 변수
        const pointer = document.getElementById("gaugePointer");
        const bar = document.getElementById("gaugeBar");
        const tooltip = document.getElementById("gaugeTooltip");

        // 게이지 바의 넓이 기준으로 포인터 위치 설정
        const barWidth = bar.offsetWidth;
        const position = (fgValue / 100) * barWidth;
        pointer.style.left = `${position}px`;

        // Tooltip 텍스트 설정
        const status = DashboardView.getFearAndGreedStatus(fgValue);
        tooltip.textContent = `${fgValue} - ${status}`;

        // Tooltip 정렬 클래스 처리
        tooltip.classList.remove("tooltip-left", "tooltip-right", "tooltip-center");

        if (fgValue < 10) {
            tooltip.classList.add("tooltip-left");
        } else if (fgValue > 90) {
            tooltip.classList.add("tooltip-right");
        } else {
            tooltip.classList.add("tooltip-center");
        }
    },

    //-------------------------------------------------------------------------------
    // renderFearAndGreed: Fear And Greed Index 차트
    // 1. Extreme Fear (극단적 공포): 0 ~ 24
    // 2. Fear (공포): 25 ~ 44
    // 3. Neutral (중립): 45 ~ 55
    // 4. Greed (탐욕): 56 ~ 74
    // 5. Extreme Greed (극단적 탐욕): 75 ~ 100
    //-------------------------------------------------------------------------------
    getFearAndGreedStatus: function (value) {
        if (value < 25) return "Extreme Fear";
        if (value < 45) return "Fear";
        if (value < 56) return "Neutral";
        if (value < 75) return "Greed";
        return "Extreme Greed";
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

