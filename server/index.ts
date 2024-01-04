Bun.serve({
    fetch: (req, server) => {
        if (server.upgrade(req)) {
            console.log("Upgraded");
        } else {
            return new Response("Upgrade failed", { status: 500 });
        }
    },
    websocket: {
        open: (ws) => {
            ws.subscribe("acceleration");
            console.log("Socket opened");
        },
        close: (ws) => {
            ws.unsubscribe("acceleration");
            console.log("Socket closed");
        },
        message: (ws, message) => {
            console.log(message);
            ws.publish("acceleration", message);
        },
    },
    port: 8082,
});
