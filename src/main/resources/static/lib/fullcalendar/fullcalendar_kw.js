let calendar;
let allHolidays = {kr: [], us: []};

function getCalendar() {
    const calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
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
        events: [],
        datesSet: () => {
            fetchHolidays();
        },
        dateClick: function (event) {
            console.log(event);
            _$("#add-trading-popup").addClass("modal-active");
        },
    });

    calendar.render();

    document.querySelector('#toggle-kr').addEventListener('change', renderCalendarEvents);
    document.querySelector('#toggle-us').addEventListener('change', renderCalendarEvents);
}

// 공휴일 정보 get
const fetchHolidays = async () => {
    const year = calendar.getDate().getFullYear();

    const [kr, us] = await Promise.all([
        fetch(`/api/holidays?country=KR&year=${year}`).then(res => res.json()),
        fetch(`/api/holidays?country=US&year=${year}`).then(res => res.json())
    ]);

    allHolidays.kr = kr;
    allHolidays.us = us;

    await renderCalendarEvents();
};

// 일지 get
const fetchUserEvents = async () => {
    const year = calendar.getDate().getFullYear();
    const month = calendar.getDate().getMonth() + 1;
    const date_yyyyMM = year.toString() + month.toString().padStart(2, '0');

    // const userEvents = await fetch(`/api/getUserDiaries?year=${year}&month=${month}`).then(res => res.json());
    const data = {
        "search_date": date_yyyyMM,
        "search_account_num": '1234-5678'
    }
    return DiaryApi.getUserEvents(data); // [{ title, start, end?, ... }]
};

const renderCalendarEvents = async () => {
    // 기존 이벤트 모두 제거
    calendar.getEvents().forEach(event => event.remove());

    // 공휴일 렌더링
    const shownCountries = [];
    if (document.querySelector('#toggle-kr').checked) shownCountries.push('kr');
    if (document.querySelector('#toggle-us').checked) shownCountries.push('us');

    const eventsMap = {};
    shownCountries.forEach(country => {
        allHolidays[country].forEach(({date, name}) => {
            if (!eventsMap[date]) eventsMap[date] = new Set();
            eventsMap[date].add(name);
        });
    });

    Object.entries(eventsMap).forEach(([date, names]) => {
        const title = Array.from(names).join(', ');
        const trimmedTitle = title.length > 30 ? title.substring(0, 30) + '...' : title;

        calendar.addEvent({
            title: trimmedTitle,
            start: date,
            allDay: true,
            display: 'background',
            backgroundColor: '#ffe6e6',
            borderColor: '#e74c3c',
            textColor: '#c0392b'
        });
    });

    // 사용자 일정 렌더링
    const userEvents = await fetchUserEvents();
    userEvents.forEach(event => {
        calendar.addEvent({
            title: getName(event),
            start: event.trading_date,
            end: event.trading_date,
            allDay: true,
            backgroundColor: '#3498db',
            borderColor: '#2980b9',
            textColor: '#ffffff'
        });
    });
};

function getName(event) {
    const ticker = event.ticker;
    const name = event.stock_name;
    return "[" + ticker + "]" + name;
}

//
// const renderHolidays = () => {
//     calendar.getEvents().forEach(event => event.remove());
//
//     const shownCountries = [];
//     if (document.querySelector('#toggle-kr').checked) shownCountries.push('kr');
//     if (document.querySelector('#toggle-us').checked) shownCountries.push('us');
//
//     const eventsMap = {};
//
//     shownCountries.forEach(country => {
//         allHolidays[country].forEach(({date, name}) => {
//             if (!eventsMap[date]) eventsMap[date] = new Set();
//             eventsMap[date].add(name);
//         });
//     });
//
//     Object.entries(eventsMap).forEach(([date, names]) => {
//         const title = Array.from(names).join(', ');
//         const trimmedTitle = title.length > 30 ? title.substring(0, 30) + '...' : title;
//
//         calendar.addEvent({
//             title: trimmedTitle,
//             start: date,
//             allDay: true,
//             display: 'background',
//             backgroundColor: '#ffe6e6',
//             borderColor: '#e74c3c',
//             textColor: '#c0392b'
//         });
//     });
// };
