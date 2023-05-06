import {injectable} from "inversify";
import { ISpentTimeService } from "@/interfaces/ISpentTimeService";
import TimeSpent from "@/models/timeSpent";
import TimeSpentVM from "@/models/timeSpentVM";


@injectable()
export class YTSpentTimeService implements ISpentTimeService {
    private YTUrl : String = "https://erusharp.youtrack.cloud";
    private YTApiUrl : String = `${this.YTUrl}/api`;
    private YTToken : String = "perm:cm9vdA==.NDctMQ==.5biuBCkKnPobYnzov4A7dmvmXErCjC";

    public getSpentTime(date: Date, userId: string): Promise<TimeSpent[]> {
        // call youtrack api
        const headers = { 'Authorization': `Bearer ${this.YTToken}` }; 
        return fetch(`${this.YTApiUrl}/workItems`+
            '?fields=issue(board,id,idReadable,project(id,shortName)),text,created,'+
            'duration(presentation,minutes),author(name),creator(name),date,id,'+
            'type(id,name)'+
            `&creator=${userId}`+
            `&date=${'1683243687560'}`, {
            headers: headers
        })
        .then(resp => resp.json())
        .then((data) => data as TimeSpent[]);
    }
    
    public async getSpentTimeVM(date: Date, userId: string): Promise<TimeSpentVM[]> {
        // call youtrack api
        const data = await this.getSpentTime(date, userId);
        return data.map(item => new TimeSpentVM(item.id, item.duration.minutes, item.type.name));
    }
}