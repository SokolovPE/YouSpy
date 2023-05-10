import {injectable} from "inversify";
import { ISpentTimeService } from "@/interfaces/ISpentTimeService";
import TimeSpent from "@/models/timeSpent";
import TimeSpentVM from "@/models/timeSpentVM";
import APP_SETTINGS from "@/constants/appsettings";


@injectable()
export class YTSpentTimeService implements ISpentTimeService {

    private getClearTimeStamp(input: number) : string {
        return new Date(input).toISOString().split('T')[0];
    }

    public getSpentTime(date: Date, userId: string): Promise<TimeSpent[]> {
        // format time
        const isoDate = date.toISOString().split('T')[0];
        const pureDate = new Date(isoDate);
        const utcTimestamp = pureDate.getTime();
        // call youtrack api
        const headers = { 'Authorization': `Bearer ${APP_SETTINGS.Token}` };
        /*return fetch(`${APP_SETTINGS.ApiConnectionString}/workItems`+
            '?fields=issue(board,id,idReadable,project(id,shortName)),text,created,'+
            'duration(presentation,minutes),author(name),creator(name),date,id,'+
            'type(id,name)'+
            `&creator=${userId}`+
            `&startDate=${date}`, {
            headers: headers
        })
        .then(resp => resp.json())
        .then((data) => data as TimeSpent[]);*/
        const query = `work author: ${userId} work date: ${isoDate}`;
        return fetch(`${APP_SETTINGS.ApiConnectionString}/workItems`+
            '?fields=issue(board,id,idReadable,project(id,shortName)),text,created,'+
            'duration(presentation,minutes),author(name),creator(name),date,id,'+
            'type(id,name)'+
            `&query=${query}`, {
            headers: headers
        })
        .then(resp => resp.json())
        .then((data) => {
            const response = data.filter((item : TimeSpent) => this.getClearTimeStamp(item.date) == this.getClearTimeStamp(utcTimestamp));
            return response as TimeSpent[];
        });
    }

    public async getSpentTimeVM(date: Date, userId: string): Promise<TimeSpentVM[]> {
        // call youtrack api
        const data = await this.getSpentTime(date, userId);
        return data.map(item => new TimeSpentVM(item.id, item.duration.minutes, item.type.name));
    }
}