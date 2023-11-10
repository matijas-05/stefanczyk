import * as SQLite from "expo-sqlite";

export interface Alarm {
    id: number;
    time: string;
    days: number;
}

export class Database {
    static db: SQLite.Database;

    static init() {
        this.db = SQLite.openDatabase("wojtyna_mateusz_5s1.db");
        this.db.transaction(
            (tx) => {
                // days -> bitmask, 127 = all days, 0 = none
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS alarms (id INTEGER PRIMARY KEY NOT NULL, time TEXT NOT NULL, days INTEGER NOT NULL DEFAULT 0);",
                );
            },
            (err) => console.error(err.message),
        );
    }

    static addAlarm(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.transaction(
                (tx) => {
                    tx.executeSql("INSERT INTO alarms (time, days) VALUES ('00:00', 0);");
                    resolve();
                },
                (err) => {
                    reject(err.message);
                },
            );
        });
    }

    static getAlarms(): Promise<Alarm[]> {
        return new Promise((resolve, reject) => {
            this.db.transaction(
                (tx) => {
                    tx.executeSql("SELECT * FROM alarms;", [], (_, { rows }) => {
                        resolve(rows._array as Alarm[]);
                    });
                },
                (err) => {
                    reject(err.message);
                },
            );
        });
    }
}
