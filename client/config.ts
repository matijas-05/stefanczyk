export class Config {
    public static apiBaseUrl = "http://192.168.1.5";
    public static apiPort = 3000;

    public static getApiUrl() {
        return this.apiBaseUrl + ":" + this.apiPort;
    }
}
