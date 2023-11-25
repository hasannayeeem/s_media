import Mail from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";
interface SendEmail {
  token: string;
}
export default class CustomHelpers {
  async sentVerificationMail(obj: SendEmail, from: string, to: string) {
    await Mail.send((message) => {
      const domain = Env.get("DOMAIN");
      const path = domain + "?token=" + obj.token;
      message
        .from(from, "Housiko")
        .to(to)
        .subject("Please confirm your email address").html(`
        Please click the following link to verify your email
        <a href="${path}">Verify email</a>
        `);
    });
  }
  async sentPasswordResetEMail(obj: SendEmail, from: string, to: string) {
    await Mail.send((message) => {
      const path = "https://beta.housiko.com/verify_password/" + obj.token;
      message.from(from, "Housiko").to(to).subject("Reset Your password").html(`
        Reset your password by clicking here
        <a href="${path}">Reset your password</a>
        `);
    });
  }
  forbidden(response) {
    response.status(403).send({ msg: "Access forbidden" });
  }
  async getUser(ctx) {
    if (ctx.auth.user) return ctx.auth.user;
    let user: any = null;
    try {
      user = await ctx.auth.use("web").authenticate();
    } catch (error) {
      user = null;
    }
    return user;
  }
}
