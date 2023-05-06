import User from "@/models/user";

// Interface to operate user data
export interface IUserService {
    // Get all users
    getUsers(): Promise<User[]>;
}