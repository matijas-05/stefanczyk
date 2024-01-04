Bun.serve({
    fetch: (req, server) => {
        if (server.upgrade(req)) {
            console.log("Upgraded");
            return;
        }
        return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        open: () => console.log("Socket opened"),
        close: () => console.log("Socket closed"),
        message: (_, message) => {
            console.log(message);
        },
    },
    port: 8082,
});
