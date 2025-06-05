var connectionState = false;
//var wsPort;
//var wsHost;

//var customPort = document.getElementById('port').value;
//var customHost = document.getElementById('host').value;
const subMenu = document.getElementById("subMenu");

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
        SetConnectionStatus(connectionState, data, wsConnectedHost, wsConnectedPort);
        console.log(data);
    },
    onDisconnect: () => {
        connectionState = false;
        SetConnectionStatus(connectionState);
    },
    onError: () => {
        connectionState = false;
        SetConnectionStatus(connectionState);
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
            var wsConnectedHost = wsHost;
            var wsConnectedPort = wsPort;
            connectionState = true;
            SetConnectionStatus(connectionState, data, wsConnectedHost, wsConnectedPort);
            console.log("Connected:", data);
        },
        onDisconnect: () => {
            connectionState = false;
            SetConnectionStatus(connectionState);
        },
        onError: () => {
            connectionState = false;
            SetConnectionStatus(connectionState);
        },
    });

    await client.connect();
}

client.on('General.Custom', async (payload) => {
    if (!payload.data.GameQueue) return;
    console.log(payload);
    const queueDiv = document.getElementById("gamequeue");
    const data = payload.data.GameQueue;
    queueDiv.innerHTML = "";
    data.forEach(item => {
        const button = document.createElement("button");
        button.className = "user-button";
        button.innerHTML = `
                <img src="${item.ProfileImageUrl}" alt="${item.UserName}">
                <span class="username">#${item.Position} ${item.UserName}</span>
                <div class="hover-zone left">Remove ${item.UserName}?</div>
                <div class="hover-zone right">Choose ${item.UserName}?</div>
            `;
        button.onclick = (event) => {
            console.log(`Clicked on ${item.UserId} (${item.UserName})`);
            const rect = button.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            if (clickX < rect.width / 2) {
                client.doAction("93265e4b-269b-4f11-99e8-00fd43ce21df",
                    { "userId": item.UserId }
                )
            } else {
                client.doAction("93265e4b-269b-4f11-99e8-00fd43ce21df",
                    { "userId": item.UserId }
                )
            }
        };
        queueDiv.appendChild(button);
    })
})

let queueOpen = false; // Initial state
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

function updateToggleButton() {
    const toggleBtn = document.getElementById("queueToggleBtn");
    toggleBtn.textContent = queueOpen ? "Close Queue" : "Open Queue";
}
let sideMenu = document.getElementById("sideMenu");
let autoHideTimer = null;
function toggleSideMenu() {
    const menu = document.getElementById("sideMenu");
    menu.classList.toggle("open");
}

function toggleQueueState() {
    const newState = !queueOpen;
    client.doAction("262d2bc5-0a35-4b61-8381-9da168eb33b7");
}

function refreshQueue() {
    client.doAction("89537336-3dd8-482d-83af-77b534ee31b5");
}
function toggleSideMenu() {
    const isOpen = sideMenu.classList.toggle("open");
    if (isOpen) {
        document.addEventListener("click", outsideClickListener);
        resetAutoHideTimer();
    } else {
        document.removeEventListener("click", outsideClickListener);
        clearTimeout(autoHideTimer);
    }
}

function outsideClickListener(e) {
    if (!sideMenu.contains(e.target) && e.target.id !== "menuToggle") {
        closeSideMenu();
    }
}

function closeSideMenu() {
    sideMenu.classList.remove("open");
    document.removeEventListener("click", outsideClickListener);
    clearTimeout(autoHideTimer);
}

function resetAutoHideTimer() {
    clearTimeout(autoHideTimer);
    autoHideTimer = setTimeout(() => {
        closeSideMenu();
    }, 10000); // Auto-hide after 10 seconds
}

function clearQueue() {
    client.doAction("ed7f8912-08d2-45dc-8742-7547b51275f2");
}
// Optional: reset timer on any button interaction
const menuButtons = sideMenu.querySelectorAll("button");
menuButtons.forEach(btn =>
    btn.addEventListener("click", () => {
        resetAutoHideTimer();
    })
);

function toggleSubMenu() {
    subMenu.classList.toggle("visible");
}
let menuVisible = false;
const menu = document.getElementById('sideMenu');

// Show menu when mouse is near left edge
document.addEventListener('mousemove', (e) => {
  if (e.clientX <= 10 && !menuVisible) {
    menu.classList.add('open');
    menuVisible = true;
  } else if (e.clientX > 260 && menuVisible) {
    // Hide if mouse moves away from menu area (menu width + buffer)
    menu.classList.remove('open');
    menuVisible = false;
  }
});

function ConnectionStatusFooter() {

}
