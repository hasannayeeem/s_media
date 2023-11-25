import User from "App/Models/User";
import Token from "../../../../Models/Token";

export default class AuthQuery {
  async register(data) {
    const user = await User.create(data);
    return user;
  }
  public async getUser(email: string) {
    return User.query().where("email", email).where("active", 1).first();
  }
  public async isEmailVerifiedQuery(token) {
    const findToken = await Token.query()
      .where("token", token)
      .where("type", "VERIFY_EMAIL")
      .preload("user", (q) => q.preload("profile"))
      .first();
    if (findToken) {
      const user: User = findToken?.user;
      if (user && user?.is_email_verified) {
        return user;
      } else {
        return false;
      }
    }
  }
  public async getUserByField(field: string, value: string) {
    const user: User | null = await User.query().where(field, value).first();
    if (user) {
      user.serialize({
        fields: {
          omit: ["created_at", "updated_at", "password"],
        },
      });
    }
    return user;
  }
  public async findUserByToken(token) {
    const findToken = await Token.query()
      .where("token", token)
      .where("type", "VERIFY_EMAIL")
      .preload("user", (q) => q.preload("profile"))
      .first();
    const user  = findToken?.user;
    await this.deleteTokenQuery(token);
    return user;
  }
  async createOrUpdateUser(userInfo) {
    return User.firstOrCreate({ email: userInfo.email }, userInfo);
  }
  public async deleteTokenQuery(token) {
    return Token.query().where("token", token).delete();
  }
}
