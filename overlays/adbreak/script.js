const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const Host = urlParams.get('host') || "127.0.0.1"
const Port = urlParams.get('port') || 8080
const Endpoint = urlParams.get('endpoint') || "";
const barColour = urlParams.get('colour') || '#AF00FF';
const _UseClock = urlParams.get('clock') || true;

const barFill = document.getElementById('barFill');
const barContainer = document.getElementById('bar-container');
const barText = document.getElementById('barText');

barFill.style.backgroundColor = `${barColour}`;
console.log(_UseClock)
let duration = 0;
let timeLeft = 0;
let timer = null;
let timeNow = null;
console.log(barColour);

var connectionState = false;
var client = new StreamerbotClient({
    host: Host,
    port: Port,
    endpoint: Endpoint,
    immediate: true,
    autoReconnect: true,
    subscribe: '*',
    onConnect: (data) => {
        connectionState = true;
        if (_UseClock === "false") return;
        dateTime()
        barContainer.style.opacity = 1;
        console.log(data);
    },
    onDisconnect: () => {
        connectionState = false;
    },
    onError: () => {
        connectionState = false;
    },
});
var upcomingAd = 0;
var nextAdInSeconds = 60;
var newAdInSecs;

/*client.on('Twitch.UpcomingAd', (data) => {
    console.log(data)
    upcomingAd++;
    if (upcomingAd >= 5) {
        upcomingAd = 0;
        var timeUntil = setInterval(() => {
            newAdInSecs = nextAdInSeconds - 1;
            console.log(newAdInSecs)
        }, 1000)
        if (newAdInSecs <= 0) {
            clearInterval(timeUntil);
        }
    }
    console.log(upcomingAd)
    //const mins = data.data.minutes;
    //const timeStamp = data.data.nextAdAt;
    //console.log(mins, timeStamp)
    return;
})*/

client.on('Twitch.AdRun', (data) => {
    var newDuration = data.data.length_seconds;
    barContainer.style.opacity = 1;
    barText.textContent = 'AD BREAK';
    barFill.style.width = '100%';
    setTimeout(() => {
        startAdBreak(newDuration)
    }, 1000)
    console.log(data)
})


function updateAdbreak() {
    const percent = (timeLeft / duration) * 100;
    barFill.style.width = percent + '%';
    if (timeLeft <= 0) {
        clearInterval(timer);
        barFill.style.width = 0;
        setTimeout(() => {
            barText.textContent = 'AD FINISHED';
        }, 1000)
        setTimeout(() => {
            barText.style.opacity = 0;
            if (_UseClock === "false") barContainer.style.opacity = 0;
            dateTime();
            barText.style.opacity = 1;
        }, 2700)
    }
    timeLeft -= 0.1;
}

function startAdBreak(newDuration) {
    clearInterval(timer);
    duration = newDuration;
    timeLeft = newDuration;
    updateAdbreak()
    clearInterval(timeNow);
    timer = setInterval(updateAdbreak, 100);
}

function dateTime() {
    timeNow = setInterval(() => {
        const time = new Date()
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const suffixes = ['th', 'st', 'nd', 'rd']
        const suffix = (time.getDate() % 10 <= 3 && time.getDate() % 100 != 11) ? suffixes[time.getDate() % 10] : suffixes[0]
    
        let hours = time.getHours()
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12
        if (hours === 0) hours = 12;
        const formatTime = (time) => time.toString().length != 2 ? '0' + time : time
        
        const formattedTime = `${(hours)}:${formatTime(time.getMinutes())}:${formatTime(time.getSeconds())} ${ampm}`
        document.getElementById('barText').innerText = formattedTime
        //console.log(formattedTime)
    },1000)
}

