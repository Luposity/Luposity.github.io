export var connectionState = false;
export var client = new StreamerbotClient({
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

export async function StreamerBotConnect () {
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
