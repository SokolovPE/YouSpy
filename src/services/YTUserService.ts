import {injectable} from "inversify";
import { IUserService } from "@/interfaces/IUserService";
import User from "@/models/user";


@injectable()
export class YTUserService implements IUserService {
    private YTUrl : String = "WHOOPS";
    private YTApiUrl : String = `${this.YTUrl}/api`;
    private YTToken : String = "WHOOPS";

    public getUsers(): Promise<User[]> {
        // call youtrack api
        const headers = { 'Authorization': `Bearer ${this.YTToken}` }; 
        return fetch(`${this.YTApiUrl}/users?fields=id,login,fullName,email,name`, {
            headers: headers
        })
        .then(resp => resp.json())
        .then((data) => data as User[]);
    }
}