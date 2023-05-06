class TimeSpentVM {
    id: String;
    spent: Number;
    type: String;

    constructor(id: String, spent: Number, type: String) {
        this.id = id;
        this.spent = spent;
        this.type = type;
    }
}

export default TimeSpentVM;