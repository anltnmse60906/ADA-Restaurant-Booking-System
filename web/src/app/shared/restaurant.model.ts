export class Restaurant {
  constructor(
              public id: number,
              public name: string,
              public location: string,
              public availableTime: Array<string>) {
  }
}
