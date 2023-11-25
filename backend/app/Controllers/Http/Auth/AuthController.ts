import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import AuthService from "./AuthService";
import AuthValidator from "./AuthValidator";
import Hash from "@ioc:Adonis/Core/Hash";
import Token from "App/Models/Token";

export default class AuthController {
  private authService: AuthService;
  private authValidator: AuthValidator;
  constructor() {
    this.authService = new AuthService();
    this.authValidator = new AuthValidator();
  }
  public async register(ctx: HttpContextContract) {
    const payload: any = await this.authValidator.validateSignupSchema(ctx);
    return this.authService.register(payload);
  }
  public async login(ctx: HttpContextContract) {
    let validatedData = await this.authValidator.validateLoginSchema(ctx);
    const user = await this.authService.getUser(validatedData.email);
    if (!user) {
      return ctx.response.status(400).send({ message: "Invalid credentials" });
    }
    const passwordMatch = await Hash.verify(
      user.password,
      validatedData.password
    );
    if (!passwordMatch) {
      return ctx.response.status(400).send({ message: "Invalid credentials" });
    }
    if (!user?.is_email_verified) {
      return user;
    }
    const login = await ctx.auth.use("web").loginViaId(user.id);
    await login?.load("profile");
    return login;
  }
  public async verify({ params, auth }: HttpContextContract) {
    const isAlreadyVerified = await this.authService.isEmailVerifiedService(
      params.token
    );
    if (isAlreadyVerified) {
      await auth.use("web").loginViaId(isAlreadyVerified.id);
      await Token.expireTokens(isAlreadyVerified, "verifyEmailTokens");
      return isAlreadyVerified;
    }
    const user = await Token.getTokenUser(params.token, "VERIFY_EMAIL");
    if (user) {
      user.is_email_verified = true;
      await user.save();
      await auth.use("web").loginViaId(user.id);
      await Token.expireTokens(user, "verifyEmailTokens");
      return user;
    } else {
      return false;
    }
  }
  public async verifyPassword(ctx: HttpContextContract) {
    const token = ctx.params.token;
    return await this.authService.verifyPassword(token);
  }
  public async resendEmail(ctx: HttpContextContract) {
    const user = ctx.auth.user;
    return await this.authService.resendEmail(user);
  }
  public async sendPasswordResetToken(ctx: HttpContextContract) {
    try {
      const data = await this.authValidator.validatePasswordResetSchema(ctx);
      const x = await this.authService.sendPasswordResetToken(data);
      return x;
    } catch (error) {
      return ctx.response.status(error.status).send({ message: error.message });
    }
  }
  public async resendVerifyEmailToken(ctx: HttpContextContract) {
    try {
      const data = await this.authValidator.validatePasswordResetSchema(ctx);
      const x = await this.authService.resendVerifyEmailToken(data);
      return x;
    } catch (error) {
      return ctx.response.status(error.status).send({ message: error.message });
    }
  }
  public async storePassword(ctx: HttpContextContract) {
    const data = await this.authValidator.passwordSchema(ctx);
    return await this.authService.storePassword(data, ctx);
  }
  async getUser(ctx: HttpContextContract) {
    const user = ctx.auth.user;
    await user?.load("plan");
    await user?.load("profile");
    return user;
  }
  async logout(ctx: HttpContextContract) {
    await ctx.auth.use("web").logout();
    return true;
  }
  public async resendEmailByToken(ctx: HttpContextContract) {
    try {
      const payload = await this.authValidator.validateResendEmailByToken(ctx);
      return await this.authService.resendEmailByTokenService(payload);
    } catch (error) {
      return error;
    }
  }
}
