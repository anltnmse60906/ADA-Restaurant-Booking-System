export class AIPResponse {
  public status: number;
  public message?: string;
  public token?: string;
  public userId?: string;
  public obj?: Array<Object>;

  constructor() {
  }

  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}
