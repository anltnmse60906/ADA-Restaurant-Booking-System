export class User {
  constructor(
    public email: string,
    public password: string,
    public lastName?: string,
    public firstName?: string,
  ) {
  }
}
