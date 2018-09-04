export class Table {
  constructor(
    public _id: String,
    public name: String,
    public capacity: number,
    public location: string,
    public isSmoking: boolean,
    public isBooked: boolean,
    public selected: boolean = false) {
  }
}
