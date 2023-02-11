//  Events
//  ===============================================================

//  Getting a new quote
const quoteBtn = document.getElementById('quote-btn');
quoteBtn.addEventListener('click', () => {
    renderRandomQuote();
})

//  Show "more" info
document.getElementById('more-btn').addEventListener('click', (event) => {
    const quoteEl = document.getElementById('quote-wrap');
    const moreSectionContainerEL = document.getElementById('more-section-container');
    const moreBtnLabel = document.getElementById('more-btn-label');

    if(event.target.checked) {
        //  Making more infos visible
        quoteEl.style.display = 'none';
        moreSectionContainerEL.style.display = '';
        moreBtnLabel.textContent = 'less';

    } else {
        //  Hiding more infos
        quoteEl.style.display = '';
        moreSectionContainerEL.style.display = 'none';
        moreBtnLabel.textContent = 'more';
    };
});

//  API related functionality 
//  ===============================================================   

//  Getting data from an API
async function getData(url) { 
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

//  Rendering a random quote
async function renderRandomQuote() {
    url = 'https://api.quotable.io/random';
    const randomQuote = await getData(url);
    document.getElementById('quote').textContent = randomQuote.content;
    document.getElementById('author').textContent = randomQuote.author;
}

//  Renders quote, time and date infos.
async function renderAPIData() {

    //  Getting a random quote
    renderRandomQuote()

    // Getting user location infos
    const apiKey = 'EqLfaYaNf7Vkc915VzmJ0uwAlhdZK11yZpOLd5AJ';
    let url = `https://api.ipbase.com/v2/info?apikey=${apiKey}`;    
    const userLocation = await getData(url).catch(err => console.log(`Fetching iobase.com data not working. Error: ${err.message}`));
    document.getElementById('timezone-code').textContent = `${userLocation.data.timezone.code}`;
    document.getElementById('location').textContent = `${userLocation.data.location.city.name}, ${userLocation.data.location.country.alpha2}`;

     
    //  Getting time/date infos
    url = 'http://worldtimeapi.org/api/ip';
    const timeData = await getData(url).catch(err => console.log(`Fetching World Time API not working. Error: ${err.message}`));
    const timeZone = timeData.timezone;
    const dayOfYear = timeData.day_of_year;
    const dayOfWeek = timeData.day_of_week;
    const weekNumber = timeData.week_number;

    document.getElementById('timezone').textContent = timeZone;
    document.getElementById('day-of-year').textContent = dayOfYear;
    document.getElementById('day-of-week').textContent = dayOfWeek;
    document.getElementById('week-number').textContent = weekNumber;
}

//  Synchronous start
//  ===============================================================

//  Adding a leading '0' if number is 1 digit long
function addLeadingZero(num) {
    (num < 10) ? (num = '0' + num) : false;
    return num
}

//  Get Time and bring it in the format '00:00:00'
function getTime() {    
    const date = new Date();
    let time = {};
    time.hrs = addLeadingZero(date.getHours()),
    time.min = addLeadingZero(date.getMinutes()),
    time.sec = addLeadingZero(date.getSeconds());
    return time;
}

//  Rendering time
function renderTime(time) {
    document.getElementById('time').textContent = `${time.hrs}:${time.min}`;
}

//  Rendering greeting
function renderGreeting(time) {
    let greeting = 'morning';
    switch (true) {
        case (time.hrs >= '12'):
            greeting = 'afternoon';
            break;
        case (time.hrs >= '17'):
            greeting = 'evening';
            break;
        case (time.hrs >= '20'):
            greeting = 'night';
            break;   
    };
    const greetingEl = document.getElementById('greeting');
    if(window.visualViewport.width < 768) {
        greetingEl.textContent = `Good ${greeting}`;
    } else {
        greetingEl.textContent = `Good ${greeting}, it's currently`;
    }
}

//  Rendering night-theme
function renderNightTheme(time) {
    const bodyEl = document.querySelector('body');
    const moreSectionContainerEl = document.getElementById('more-section-container');
    const greetingEl = document.getElementById('greeting');
    if(time.hrs <= '07' || time.hrs >= '20' ) {
        bodyEl.style.backgroundImage = 'var(--mainBG-night)';
        moreSectionContainerEl.style.color = 'white';
        moreSectionContainerEl.style.backgroundColor = '#000000bf';
        greetingEl.style.setProperty('--svg', 'url(./assets/desktop/icon-moon.svg)');
    } else {
        bodyEl.style.backgroundImage = '';
        moreSectionContainerEl.style.color = '';
        moreSectionContainerEl.style.backgroundColor = '';
    };
}

function timeDataRender(time) {
    renderTime(time); 
    if(time.min == '00' || timeDataRender.firstCall) {        
        renderGreeting(time);
        renderNightTheme(time);
    };
};

//  Instatly rendering time related data (time, greeting, background)
timeDataRender.firstCall = true;
timeDataRender(getTime());
timeDataRender.firstCall = false;

// Periodically rendering time related data (time, greeting, background)
setInterval(() => {
    timeDataRender(getTime());
}, 1000);

//  Collecting and rendering API data
renderAPIData();


