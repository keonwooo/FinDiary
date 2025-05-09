let calendar;
let allHolidays = {kr: [], us: []};

const KW_FullCalendar = {
    getCalendar: function () {
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
            editable: false,
            events: [],
            datesSet: () => {
                KW_FullCalendar.fetchHolidays();
            },
            dateClick: function (event) {
                DiaryView.setting.addDiary(event);
            },
            eventClick: function (event) {
                DiaryView.setting.editDiary(event.event.extendedProps);
            }
        });

        calendar.render();

        // 공휴일 change event
        document.querySelectorAll('.search-country-checkbox').forEach(toggle => {
            toggle.addEventListener('change', KW_FullCalendar.renderCalendarEvents);
        });

        // 계좌 change event
        document.querySelectorAll('.search-account-checkbox').forEach(toggle => {
            toggle.addEventListener('change', KW_FullCalendar.renderCalendarEvents);
        });
    },

    // 공휴일 정보 get
    fetchHolidays: async function () {
        const year = calendar.getDate().getFullYear();

        // TODO 여기서 나라 여러개 받아서 한번에 처리하도록
        let data = {
            "country_code": COUNTRY_CODE_KOREA,
            "date": year
        }
        allHolidays.kr = await DiaryApi.getHolidays(data);

        data.country_code = COUNTRY_CODE_US;
        allHolidays.us = await DiaryApi.getHolidays(data);

        await KW_FullCalendar.renderCalendarEvents();
    },

    // 일지 get
    fetchUserEvents: async function () {
        const year = calendar.getDate().getFullYear();
        const month = calendar.getDate().getMonth() + 1;
        const date_yyyyMM = year.toString() + month.toString().padStart(2, '0');

        const search_account_num = FinDiary.getMultiSelected(".search-account-checkbox");

        if (search_account_num.length === 0) {
            return;
        }

        const data = {
            "search_date": date_yyyyMM,
            "search_selected_account_num": search_account_num
        }
        return DiaryApi.getUserEvents(data); // [{ title, start, end?, ... }]
    },

    // calendar event render
    renderCalendarEvents: async function () {
        // 기존 이벤트 모두 제거
        calendar.getEvents().forEach(event => event.remove());

        // 공휴일 렌더링
        const shownCountries = [];
        if (document.querySelector('#toggle-kr').checked) shownCountries.push('kr');
        if (document.querySelector('#toggle-us').checked) shownCountries.push('us');

        const eventsMap = {};
        shownCountries.forEach(country => {
            allHolidays[country].forEach(({holiday, name}) => {
                if (!eventsMap[holiday]) eventsMap[holiday] = new Set();
                eventsMap[holiday].add(name);
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
        const userEvents = await KW_FullCalendar.fetchUserEvents();
        userEvents?.forEach(event => {
            const trading_type = event.trading_type;
            let background_color = '#e74c3c';
            let border_color = '#c0392b';

            if (trading_type === TRADING_TYPE_SELL) {
                background_color = '#3498db';
                border_color = '#2980b9';
            }

            event.title = FinDiary.getNumberAndName(event.ticker, event.stock_name);
            const title = event.title + ' ' + event.trading_price + (event.currency === 'won' ? '₩' : '$') + ', ' + (event.trading_type === 'buy' ? '+' : '-') + event.trading_count;
            calendar.addEvent({
                title: title,
                start: event.trading_date,
                end: event.trading_date,
                allDay: true,
                className: ['all-font13'],
                backgroundColor: background_color,
                borderColor: border_color,
                textColor: '#ffffff',
                fontSize: '3px',
                extendedProps: event
            });
        });
    },
}