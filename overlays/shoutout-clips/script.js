var connectionState = false;
var client = new StreamerbotClient({
    host: "127.0.0.1",
    port: 8080,
    immediate: true,
    autoReconnect: true,
    subscribe: '*',
    onConnect: (data) => {
        var wsConnectedPort = 8080;
        var wsConnectedHost = "127.0.0.1";
        connectionState = true;
        //getStreamerBotValue()
        //SetConnectionStatus(connectionState, data, wsConnectedHost, wsConnectedPort);
        console.log(data);
    },
    onDisconnect: () => {
        connectionState = false;
        //SetConnectionStatus(connectionState);
    },
    onError: () => {
        connectionState = false;
        //SetConnectionStatus(connectionState);
    },
});

const container = document.getElementById("clipContainer");
const socket = new WebSocket('ws://localhost:8080'); // Adjust to your server

let currentIframe = null;

function showClip(clipId) {
    const embedUrl = `https://clips.twitch.tv/embed?clip=${clipId}&parent=https://luposity.github.io/&autoplay=true&muted=false`;

    // Clean up any existing iframe
    if (currentIframe) {
        container.removeChild(currentIframe);
        currentIframe = null;
    }

    // Create new iframe
    const iframe = document.createElement("iframe");
    iframe.src = embedUrl;
    const AUTO_HIDE_TIMEOUT = 60000;

    iframe.onload = () => {
        container.classList.add("visible");

        setTimeout(() => {
            container.classList.remove("visible");

            // Remove iframe after fade-out
            setTimeout(() => {
                if (iframe.parentNode === container) {
                    container.removeChild(iframe);
                    currentIframe = null;
                }
            }, 1000); // Matches CSS transition time
        }, AUTO_HIDE_TIMEOUT);
    };

    container.appendChild(iframe);
    currentIframe = iframe;
}

client.on('Custom.CodeEvent', async (data) => {
    var clipId = data.data.args.clipId;
    console.log(clipId);
    showClip(clipId);
    console.log(data);
})
