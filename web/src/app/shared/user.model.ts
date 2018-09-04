export class User {
  constructor(
    public email: string,
    public password: string,
    public phoneNumber?: string,
    public lastName?: string,
    public firstName?: string,
  ) {
  }
}
