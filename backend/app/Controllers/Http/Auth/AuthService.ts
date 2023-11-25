import CustomHelpers from "App/Helpers/CustomHelpers";
import Token from "App/Models/Token";
import AuthQuery from "./AuthQuery";
import { Exception } from "@adonisjs/core/build/standalone";
import PlanQuery from "../Plan/PlanQuery";

export default class AuthService {
  private authQuery: AuthQuery;
  public from_email = "noreply@housiko.com";
  public customHelpers: CustomHelpers;
  public planQuery: PlanQuery;
  constructor() {
    this.authQuery = new AuthQuery();
    this.customHelpers = new CustomHelpers();
    this.planQuery = new PlanQuery();
  }
  public async register(data) {
    data.is_email_verified = 0;
    const user = await this.authQuery.register(data);
    this.planQuery.createPlan({
      user_id: user?.id,
      plan: "free",
    });
    if (user) {
      const token = await Token.generateVerifyEmailToken(user);
      let obj: any = {
        token,
        full_name: user?.full_name,
      };
      await this.customHelpers.sentVerificationMail(
        obj,
        this.from_email,
        user.email
      );
    }
    return user;
  }
  public async getUser(email: string) {
    const user = await this.authQuery.getUser(email);
    return user;
  }
  public async isEmailVerifiedService(token) {
    return this.authQuery.isEmailVerifiedQuery(token);
  }
  public async verifyPassword(token) {
    const isValid = await Token.verify(token, "PASSWORD_RESET");
    if (!isValid) {
      return false;
    } else {
      return true;
    }
  }
  public async resendEmail(user) {
    const token = await Token.generateVerifyEmailToken(user);
    let obj: any = {
      token,
      full_name: user?.full_name,
    };
    await this.customHelpers.sentVerificationMail(
      obj,
      this.from_email,
      user.email
    );
    return user;
  }
  public async sendPasswordResetToken(data) {
    const user = await this.authQuery.getUserByField("email", data.email);
    if (user && user.auth_provider) {
      throw new Exception(
        "You are connected via social account",
        400,
        "E_INVALID_REQUEST"
      );
    } else if (user) {
      const token = await Token.generatePasswordResetToken(user);
      let obj: any = {
        token,
        full_name: user?.full_name,
      };
      await this.customHelpers.sentPasswordResetEMail(
        obj,
        this.from_email,
        user.email
      );
      return user;
    } else {
      return false;
    }
  }
  public async resendVerifyEmailToken(data) {
    const user = await this.authQuery.getUserByField("email", data.email);
    if (user && user.auth_provider) {
      throw new Exception(
        "You are connected via social account",
        400,
        "E_INVALID_REQUEST"
      );
    } else if (user) {
      const token = await Token.generateVerifyEmailToken(user);
      let obj: any = {
        token,
        full_name: user?.full_name,
      };
      await this.customHelpers.sentVerificationMail(
        obj,
        this.from_email,
        user.email
      );
      return user;
    } else {
      return false;
    }
  }
  public async storePassword(data: any, ctx) {
    const isValid = await Token.verify(data.token, "PASSWORD_RESET");
    if (!isValid) {
      return ctx.response.status(400).send({ message: "Token is invalid" });
    } else {
      const user = await Token.getTokenUser(data.token, "PASSWORD_RESET");
      if (!user) {
        return ctx.response.status(400).send({
          message: "Token expired or associated user could not be found",
        });
      }
      await user.merge({ password: data.password }).save();
      const login = await ctx.auth.login(user);
      await login?.load("profile");
      await Token.expireTokens(user, "passwordResetTokens");
      return login;
    }
  }
  public async resendEmailByTokenService(payload) {
    const user: any = await this.authQuery.findUserByToken(payload.token);
    const token = await Token.generateVerifyEmailToken(user);

    let obj: any = {
      token,
      full_name: user?.full_name,
    };
    await this.customHelpers.sentVerificationMail(
      obj,
      this.from_email,
      user.email
    );
    return user;
  }
  public async isUser(data) {
    const user = await this.authQuery.getUserByField("email", data.email);
    if (!user) {
      return "Invalid Email";
    }
    return false;
  }
}
