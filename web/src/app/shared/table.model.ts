export class Table {
  constructor(public name: String,
              public capacity: number,
              public location: string,
              public isSmoking: boolean,
              public selected: boolean = false) {
  }
}
