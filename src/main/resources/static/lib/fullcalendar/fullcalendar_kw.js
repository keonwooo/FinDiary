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
        }
    });

    calendar.render();

    document.querySelector('#toggle-kr').addEventListener('change', renderHolidays);
    document.querySelector('#toggle-us').addEventListener('change', renderHolidays);
}

const fetchHolidays = async () => {
    const year = calendar.getDate().getFullYear();

    const [kr, us] = await Promise.all([
        fetch(`/api/holidays?country=KR&year=${year}`).then(res => res.json()),
        fetch(`/api/holidays?country=US&year=${year}`).then(res => res.json())
    ]);

    allHolidays.kr = kr;
    allHolidays.us = us;

    renderHolidays();
};

const renderHolidays = () => {
    calendar.getEvents().forEach(event => event.remove());

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
            title,
            start: date,
            allDay: true,
            display: 'background',
            backgroundColor: '#ffe6e6',
            borderColor: '#e74c3c',
            textColor: '#c0392b'
        });
    });
};
