const client = new StreamerbotClient({
    port: 8080,
    immediate: true,
    autoReconnect: true,
    subscribe: '*',
    onConnect: (data) => {
        console.log(data);
    },
    onDisconnect: () => {
        SetConnectionStatusFalse();
    },
    onError: () => {
        SetConnectionStatusFalse();
    },
});

client.on('General.Custom', async (payload) => {
    if (!payload.data.GameQueue) return;
    const queueDiv = document.getElementById("gamequeue");
    const data = payload.data.GameQueue;
    queueDiv.innerHTML = "";
    data.forEach(item => {
        const button = document.createElement("button");
        button.className = "user-button";
        //button.style.animationDelay = `${1000 * 100}ms`;
        button.innerHTML = `
                <img src="${item.ProfileImageUrl}" alt="${item.UserName}">
                <span class="username">#${item.Position} ${item.UserName}</span>
                <div class="hover-zone left">Remove ${item.UserName}?</div>
                <div class="hover-zone right">Promote ${item.UserName}?</div>
            `;
        button.onclick = (event) => {
            console.log(`Clicked on ${item.UserId} (${item.UserName})`);
            const rect = button.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            if (clickX < rect.width / 2) {
                // Left side clicked → Remove
                client.doAction("93265e4b-269b-4f11-99e8-00fd43ce21df",
                    { "userId": item.UserId }
                )
            } else {
                // Right side clicked → Promote (example)
                client.doAction("93265e4b-269b-4f11-99e8-00fd43ce21df",
                    { "userId": item.UserId }
                )
                //socket.send(JSON.stringify({ action: "promote", userId: item.UserId }));
            }
        };
        queueDiv.appendChild(button);
    })
})

let queueOpen = false; // Initial state
function SetConnectionStatusTrue() {
    const statusHeader = document.getElementById("queueState");
    statusHeader.innerText = "Streamer.Bot Connected!";
}
function SetConnectionStatusFalse() {
    const statusHeader = document.getElementById("queueState");
    statusHeader.innerText = "Streamer.Bot Disconnected...";
}
function updateToggleButton() {
    const toggleBtn = document.getElementById("toggleQueueBtn");
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

// Optional: reset timer on any button interaction
const menuButtons = sideMenu.querySelectorAll("button");
menuButtons.forEach(btn =>
    btn.addEventListener("click", () => {
        resetAutoHideTimer();
    })
);