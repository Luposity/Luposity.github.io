//import { connectionState, client, StreamerBotConnect } from "../../scripts/client.js";

var connectionState = false;
var client = new StreamerbotClient({
    host: "127.0.0.1",
    port: 8080,
    immediate: true,
    autoReconnect: false,
    subscribe: '*',
    onConnect: (data) => {
        var wsConnectedPort = 8080;
        var wsConnectedHost = "127.0.0.1";
        connectionState = true;
        getStreamerBotValue()
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

async function StreamerBotConnect () {
    const wsHost = document.getElementById('host').value;
    const wsPort = document.getElementById('port').value;

    client = new StreamerbotClient({
        host: wsHost,
        port: wsPort,
        immediate: false,
        autoReconnect: false,
        subscribe: '*',
        onConnect: (data) => {
            //var wsConnectedHost = wsHost;
            //var wsConnectedPort = wsPort;
            //connectionState = true;
            //SetConnectionStatus(connectionState, data, wsConnectedHost, wsConnectedPort);
            console.log("Connected:", data);
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

    await client.connect();
}
function SetConnectionStatus(connectionState, data, wsConnectedHost, wsConnectedPort) {
    const footer = document.getElementById("footer");
    const status = document.getElementById("statusIndicator");
    footer.classList.add("visible");

    if (connectionState) {
        status.innerText = `Connected to ${data.name} (${data.version})`;
        footer.classList.remove("disconnected");
        footer.classList.add("connected");
        setTimeout(() => {
            refreshQueue();
        }, 1000)
        setTimeout(() => {
            footer.classList.remove("visible");
        }, 10000);
    } else {
        status.innerText = "Streamer.Bot Disconnected. Try connecting in the Settings tab (⚙)";
        footer.classList.remove("connected");
        footer.classList.add("disconnected");
    }
}
client.on('General.Custom', (data) => {
    console.log(data);
})
client.on('Twitch.Sub', (data) => {
    console.log(data)
    var amount = 2.49;
    const subTier = data.data.sub_tier;
    if (subTier === "1000") amount = 2.49;
    if (subTier === "2000") amount = 3.99
    if (subTier === "3000") amount = 9.99;
    addProgress(amount);
})
client.on('Twitch.Cheer', (data) => {
    console.log(data)
    const bitsAmount = data.data.bits;
    var amount = bitsAmount/100;
    addProgress(amount);
    console.log(amount)
})
client.on('Twitch.ReSub', (data) => {
    var amount = 2.49;
    const subTier = data.data.subTier;
    if (subTier === "1000") amount = 2.49;
    if (subTier === "2000") amount = 3.99
    if (subTier === "3000") amount = 9.99;
    addProgress(amount);
    console.log(data);
})
client.on('Twitch.GiftSub', (data) => {
    var amount = 2.49;
    const subTier = data.data.sub_tier;
    if (subTier === "1000") amount = 2.49;
    if (subTier === "2000") amount = 3.99
    if (subTier === "3000") amount = 9.99;
    addProgress(amount);
    console.log(data);
})
client.on('Twitch.GiftBomb', (data) => {
    console.log(data);
})
client.on('Twitch.AutomaticRewardRedemption', (data) => {
    console.log(data);
})
client.on('Kofi.Subscription', (data) => {
    const value = data.data.amount;
    var amount = parseFloat(value);
    addProgress(amount);
    console.log(data);
})
client.on('Kofi.Resubscription', (data) => {
    const value = data.data.amount;
    var amount = parseFloat(value);
    addProgress(amount);
})
client.on('Kofi.Donation', (data) => {
    const value = data.data.amount;
    var amount = parseFloat(value);
    addProgress(amount);
    console.log(data);
})
const goal = 500.00;
let current = 0.00;

const loadingBar = document.getElementById("loadingBar");
const currentValue = document.getElementById("currentValue");

function updateBar() {
    const percent = Math.min((current / goal) * 100, 100);
    loadingBar.style.width = percent + "%";

    // Remove rounding at 100%
    if (percent >= 100) {
        loadingBar.classList.add("no-radius");
    } else {
        loadingBar.classList.remove("no-radius");
    }

    currentValue.textContent = `£${Math.min(current, goal).toFixed(2)}`;
}

function addProgress(amount) {
    current += amount;
    updateBar();
    updateStreamerBotGoal()
}

async function updateStreamerBotGoal() {
    client.doAction("220dff34-c2ee-4aba-a5bb-0d2fcc4873c3", {
        "goalAmount": current
    })
}

async function getStreamerBotValue() {
    const globalvariable = await client.getGlobal("_MonthlyIncomeGoal");
    const value = globalvariable.variable.value;
    current = value;
    updateBar()
    console.log(value);
}

const goalTitle = document.getElementById("goalName");

let index = 0;
const messages = [
    "MONTHLY LIVING GOAL",
    "SUPPORT ME ON KO-FI - !KOFI FOR MORE",
    "GOAL UPDATES ON TWITCH SUBS, BITS & KO-FI SUBS AND DONATIONS",
    "35% OFF GIFTED TWITCH - 5 OR MORE GIFTED SUBS",
    "MONTHLY LIVING GOAL - BILLS & FOOD",
    "COMMISSIONS FOR AVATAR RETEXTURES & STREAMER.BOT ARE OPEN - !COMM"
]

const interval = setInterval(() => {
    index = (index + 1) % messages.length;
    goalTitle.textContent = messages[index];

    requestAnimationFrame(() => {
        goalTitle.classList.add("goalNameVisible");
    })

    setTimeout(() => {
        goalTitle.classList.remove("goalNameVisible");
    }, 10000)
}, 15000)

interval();