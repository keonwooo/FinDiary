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

        DashboardView.renderShareholding();

        DashboardView.renderFearAndGreed();
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
        const indexValue = response.responseJSON.currentValue;
        // const indexValue = [72];  // 0 ~ 100

        // 정의된 범위
        const zones = [
            { label: 'Extreme Fear', range: [0, 24] },
            { label: 'Fear',         range: [25, 44] },
            { label: 'Neutral',      range: [45, 55] },
            { label: 'Greed',        range: [56, 74] },
            { label: 'Extreme Greed',range: [75, 100] }
        ];

        // 색상 생성 함수
        function generateColors(count) {
            const colors = [];
            for (let i = 0; i < count; i++) {
                const hue = Math.floor((360 / count) * i); // 0~360 색상 고르게 분산
                colors.push(`hsl(${hue}, 70%, 60%)`);
            }
            return colors;
        }

        // 배경 zone 색상 지정
        const colors = generateColors(zones.length);
        const gaugeBg = document.getElementById('gauge-bg');
        zones.forEach((zone, i) => {
            const div = document.createElement('div');
            div.className = 'zone';
            div.style.backgroundColor = colors[i];
            div.innerText = zone.label;
            gaugeBg.appendChild(div);
        });

        // 현재 상태 판단
        function getStatus(value) {
            for (let i = 0; i < zones.length; i++) {
                const [min, max] = zones[i].range;
                if (value >= min && value <= max) {
                    return { label: zones[i].label, color: colors[i] };
                }
            }
            return { label: 'Unknown', color: '#888' };
        }

        // 게이지 바 설정
        const bar = document.getElementById('gauge-bar');
        const label = document.getElementById('gauge-label');

        window.addEventListener('load', () => {
            const status = getStatus(indexValue);
            bar.style.width = indexValue + '%';
            bar.style.backgroundColor = status.color;
            label.textContent = `${indexValue} - ${status.label}`;
        });



        // const value = 70; // 예: Fear & Greed Index 값 (0~100)
        // const remaining = 100 - value;
        //
        // DashboardApi.getFearGreedIndex();
        //
        // const ctx = document.getElementById('chart-gague-fearandgreed').getContext('2d');
        // const gaugeChart = new Chart(ctx, {
        //     type: 'doughnut',
        //     data: {
        //         datasets: [{
        //             data: [value, remaining],
        //             backgroundColor: ['#4caf50', '#e0e0e0'], // 초록, 회색
        //             borderWidth: 0,
        //             circumference: 180,
        //             rotation: 270,
        //             cutout: '80%',
        //         }]
        //     },
        //     options: {
        //         responsive: true,               // 반응형
        //         maintainAspectRatio: false,    // div에 맞춤
        //         plugins: {
        //             tooltip: {enabled: false},
        //             legend: {display: false},
        //         }
        //     }
        // });
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

