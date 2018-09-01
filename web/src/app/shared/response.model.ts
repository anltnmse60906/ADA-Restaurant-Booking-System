export class AIPResponse {
  public status: number;
  public message?: string;
  public token?: string;
  public userId?: string;

  constructor() {
  }

  fromJSON(json) {
    for (var propName in json)
      this[propName] = json[propName];
    return this;
  }
}
