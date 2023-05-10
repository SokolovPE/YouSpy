class TimeSpent {
    id!: String;
    date!: number;
    duration!: Duration;
    type!: TimeSpentType;
    text!: String;
    get spent() {
        return this.duration.minutes;
    }
    get groupType() {
        return this.type.name;
    }
}

class Duration {
    minutes!: Number;
    presentation!: String;
}

class TimeSpentType {
    id!: String;
    name!: String;
}

export default TimeSpent;