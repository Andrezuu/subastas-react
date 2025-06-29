export interface IUser {
  id: string;
  username: string;
  avatar?: string;
  role: "admin" | "user";
}
