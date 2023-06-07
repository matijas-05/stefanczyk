import * as userModel from "./app/models/userModel";

export type Profile = Omit<userModel.User, "id" | "confirmed" | "password">;
