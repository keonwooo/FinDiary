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
function onloadpage()
{
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
    definePage: function()
    {
        console.log(`${this.name} definePage ::::: `);

        this.calendarRendering();
    },


    /********************************************************************************
     * Define Event Object (이벤트 바인딩, 클릭, 변경, 입력 등)
     ********************************************************************************/
    defineEvent: function()
    {
        console.log(`${this.name} defineEvent ::::: `);

    },

    /********************************************************************************
     * Init Data Loading Object (최초 진입 시 백엔드로부터 데이터 받아와 UI 반영)
     ********************************************************************************/
    initDataLoading: function()
    {
        console.log(`${this.name} initDataLoading ::::: `);
    },

    /********************************************************************************
     * Main Function Object
     ********************************************************************************/

    calendarRendering: function() {
        console.log(`${this.name} calendarRendering ::::: `);

        let calendarEl = document.getElementById('calendar');

        let calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',        // 초기 로딩 뷰
            initialDate: new Date(),            // 시작 날짜 설정
            locale: 'ko',
            headerToolbar: {
                left: 'prev today',
                center: 'title',
                right: 'next'
            },
            height: '100%',
            width: '100%',
            editable: true,
            events: async function(info, successCallback, failureCallback) {
                try {
                    const year = new Date().getFullYear();

                    const [krRes, usRes] = await Promise.all([
                        fetch(`/api/holidays/${year}/KR`),
                        fetch(`/api/holidays/${year}/US`)
                    ]);

                    const krData = await krRes.json();
                    const usData = await usRes.json();

                    const combinedEvents = combineHolidaysByDate([...krData, ...usData]);

                    successCallback(combinedEvents);
                } catch (err) {
                    console.error(err);
                    failureCallback(err);
                }
            },
            eventClick: function(info) {
                console.log(info.event.title);
            }
        });

        calendar.render();
    },

    /********************************************************************************
     * User Object : 사용자 정의 함수 정의
     ********************************************************************************/
    userCustom: function() {},

    /********************************************************************************
     * Dummay Object : 더미
     ********************************************************************************/
    endPage: function() {}
};


/********************************************************************************
 * Page Public Object (외부접근용)
 ********************************************************************************/
var PublicDiaryView = {
    name: "PublicDiaryView",
    selects: DiaryView.selects
};


const calendarTestData = [{
        title: 'All Day Event',
        start: '2025-04-01'
    },
    {
        title: 'Long Event',
        start: '2025-04-07',
        end: '2025-04-10'
    },
    {
        groupId: '999',
        title: 'Repeating Event',
        start: '2025-04-09'
    },
    {
        groupId: '999',
        title: 'Repeating Event',
        start: '2025-04-16T16:00:00'
    },
    {
        title: 'Conference',
        start: '2025-04-11',
        end: '2025-04-13'
    },
    {
        title: 'Meeting',
        start: '2025-04-12T10:30:00',
        end: '2025-04-12T12:30:00'
    },
    {
        title: 'Lunch',
        start: '2025-04-12T12:00:00'
    },
    {
        title: 'Meeting',
        start: '2025-04-12T14:30:00'
    },
    {
        title: 'Birthday Party',
        start: '2025-04-13T07:00:00'
    },
    {
        title: 'Click for Google',
        url: 'https://google.com/',
        start: '2025-04-28'
    }];

const combineHolidaysByDate = (holidays) => {
    const dateMap = {};

    holidays.forEach(h => {
        const date = h.date;
        const name = h.localName;

        if (!dateMap[date]) {
            dateMap[date] = new Set(); // 중복 제거용 Set 사용
        }

        dateMap[date].add(name); // 자동으로 중복된 이름은 제거됨
    });

    return Object.entries(dateMap).map(([date, nameSet]) => {
        const uniqueNames = Array.from(nameSet);
        let title = uniqueNames.join(', ');

        // 30자 이상이면 잘라서 ... 추가
        if (title.length > 30) {
            title = title.substring(0, 30) + '...';
        }

        return {
            title,
            start: date,
            allDay: true,
            display: 'background',
            backgroundColor: '#ffe6e6',
            borderColor: '#e74c3c',
            textColor: '#c0392b'
        };
    });
};