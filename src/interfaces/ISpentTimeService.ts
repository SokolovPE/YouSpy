import TimeSpent from "@/models/timeSpent";
import TimeSpentVM from "@/models/timeSpentVM";

// Interface to operate user time spent
export interface ISpentTimeService {
    // Get time spent by user for some date
    getSpentTime(date: Date, userId: string): Promise<TimeSpent[]>;
    // Get time spent by user for some date
    getSpentTimeVM(date: Date, userId: string): Promise<TimeSpentVM[]>;
}