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

        DashboardView.renderStockHeatmap();

        DashboardView.renderLiveTradingChart();
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
        const data = {
            "account_num": "6370-0000"
            , "currency": "dollar"
        }

        const responseData = DashboardApi.getShareholding(data).responseJSON;
        const bankAccount = responseData.bankAccount;
        const holdingStock = responseData.holdingStockList;

        let labels = DashboardView.getHoldingStockName(holdingStock);
        labels.push(bankAccount.currency);

        // 동적으로 색상 생성
        const backgroundColors = generateColors(labels.length);

        renderChart(
            'chart-pie-shareholding',       // canvas id
            'pie',           // chart type
            labels, // labels
            [{
                label: 'Votes',
                data: DashboardView.getHoldingStockPrice(bankAccount, holdingStock),
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
    // renderStockHeatmap: 히트맵 차트 렌더링
    //-------------------------------------------------------------------------------
    renderStockHeatmap: function() {
        const config = {
            "dataSource": "SPX500",
            "blockSize": "market_cap_basic",
            "blockColor": "change",
            "grouping": "sector",
            "locale": "kr",
            "symbolUrl": "",
            "colorTheme": "light",
            "exchanges": [],
            "hasTopBar": false,
            "isDataSetEnabled": false,
            "isZoomEnabled": true,
            "hasSymbolTooltip": true,
            "isMonoSize": false,
            "width": "100%",
            "height": "100%"
        };

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify(config, null, 2);  // 줄바꿈 포함된 JSON 문자열 삽입

        document.querySelector(".tradingview-widget-container").appendChild(script);
    },

    //-------------------------------------------------------------------------------
    // renderLiveTradingChart: 실시간 주가 차트 렌더링
    //-------------------------------------------------------------------------------
    renderLiveTradingChart: function() {
        const config = {
            symbol: "NASDAQ:TSLA",
            interval: "D",
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "en",
            allow_symbol_change: true,
            support_host: "https://www.tradingview.com"
        };

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify(config, null, 2);

        document.querySelector(".tradingview-widget-container.liveTradingChart").appendChild(script);
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
    // get holding stock name
    // get 보유중인 주식의 이름
    //-------------------------------------------------------------------------------
    getHoldingStockName: function (holdingStockList) {
        const length = holdingStockList.length;
        let returnName = new Array();
        for (let i = 0; i < length; i++) {
            returnName.push(holdingStockList[i].ticker);
        }
        return returnName;
    },

    getHoldingStockPrice(bankAccount, holdingStock) {
        const length = holdingStock.length;
        let returnPrice = new Array();
        for (let i = 0; i < length; i++) {
            returnPrice.push(holdingStock[i].holding_total_price);
        }
        returnPrice.push(bankAccount.account_total_property);
        return returnPrice;
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

