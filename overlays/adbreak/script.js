const defaultHost = "127.0.0.1";
const defaultPort = 8080;
const defaultEndpoint = "";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const customHost = urlParams.get('host')
const customPort = urlParams.get('port')
const customEndpoint = urlParams.get('endpoint')

const barFill = document.getElementById('barFill');
const barContainer = document.getElementById('bar-container');
const barText = document.getElementById('barText');

let duration = 0;
let timeLeft = 0;
let timer = null;

console.log(customHost, customPort, "/"+customEndpoint)

var connectionState = false;
var client = new StreamerbotClient({
    host: customHost ?? defaultHost,
    port: customPort ?? defaultPort,
    endpoint: customEndpoint ?? defaultEndpoint,
    immediate: true,
    autoReconnect: false,
    subscribe: '*',
    onConnect: (data) => {
        connectionState = true;
        console.log(data);
    },
    onDisconnect: () => {
        connectionState = false;
    },
    onError: () => {
        connectionState = false;
    },
});


client.on('Twitch.AdRun', (data) => {
    var newDuration = data.data.length_seconds;
    barContainer.style.opacity = 1;
    barText.textContent = 'AD BREAK';
    barFill.style.width = '100%';
    startAdBreak(newDuration)
    console.log(data)
})


function updateAdbreak() {
    const percent = (timeLeft / duration) * 100;
    barFill.style.width = percent + '%';
    if (timeLeft <= 0) {
        clearInterval(timer);
        barFill.style.width = '0%';
        barText.textContent = 'AD BREAK FINISHED';
        setTimeout(() => {
            barContainer.style.opacity = 0;
        }, 2700)
    }
    timeLeft -= 0.1;
}

function startAdBreak(newDuration) {
    clearInterval(timer);
    duration = newDuration;
    timeLeft = newDuration;
    updateAdbreak()
    timer = setInterval(updateAdbreak, 100);
}
