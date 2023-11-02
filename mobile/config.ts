import * as SecureStore from "expo-secure-store";

export class Config {
    public static get apiIp(): Promise<string> {
        return (async () => {
            return (await SecureStore.getItemAsync("apiIp")) ?? "192.168.1.5";
        })();
    }
    public static set apiIp(ip: string) {
        (async () => {
            await SecureStore.setItemAsync("apiIp", ip);
        })();
    }

    public static get apiPort(): Promise<string> {
        return (async () => {
            return (await SecureStore.getItemAsync("apiPort")) ?? "3000";
        })();
    }
    public static set apiPort(port: string) {
        (async () => {
            await SecureStore.setItemAsync("apiPort", port);
        })();
    }

    public static async getApiUrl() {
        return `http://${await Config.apiIp}:${await Config.apiPort}`;
    }
}
