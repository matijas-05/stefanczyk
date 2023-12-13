import * as SQLite from "expo-sqlite";

export interface Alarm {
    id: number;
    time: string;
    days: string;
}

export class Database {
    static db: SQLite.Database;

    static init() {
        this.db = SQLite.openDatabase("wojtyna_mateusz_5s1.db");
        this.db.transaction(
            (tx) => {
                // days -> stringified bitmask
                tx.executeSql(
                    "CREATE TABLE IF NOT EXISTS alarms (id INTEGER PRIMARY KEY NOT NULL, time TEXT NOT NULL DEFAULT '00:00', days TEXT NOT NULL DEFAULT '0000000');",
                );
            },
            (err) => console.error(err.message),
        );
    }

    static getAlarms(): Promise<Alarm[]> {
        return new Promise((resolve, reject) => {
            this.db.transaction(
                (tx) => {
                    tx.executeSql("SELECT * FROM alarms;", [], (_, { rows }) => {
                        resolve(rows._array as Alarm[]);
                    });
                },
                (err) => reject(err.message),
            );
        });
    }

    static addAlarm(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.transaction(
                (tx) => {
                    tx.executeSql("INSERT INTO alarms (time, days) VALUES ('00:00', 0);");
                    resolve();
                },
                (err) => reject(err.message),
            );
        });
    }
    static deleteAlarm(id: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.transaction(
                (tx) => {
                    tx.executeSql("DELETE FROM alarms WHERE id = ?;", [id]);
                    resolve();
                },
                (err) => reject(err.message),
            );
        });
    }
    static updateAlarm(id: number, days: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.transaction(
                (tx) => {
                    tx.executeSql("UPDATE alarms SET days = ? WHERE id = ?;", [days, id]);
                    resolve();
                },
                (err) => reject(err.message),
            );
        });
    }
}
