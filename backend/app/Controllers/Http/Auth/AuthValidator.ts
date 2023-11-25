import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
export default class AuthValidator { 
  public async validateSignupSchema(ctx: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.unique({ table: "users", column: "email", where: { active: 1 } }),
      ]),

      full_name: schema.string.optional({
        escape: true,
        trim: true,
      }),

      password: schema.string({ escape: true, trim: true }, [
        rules.minLength(6),
        rules.maxLength(16),
        rules.confirmed(),
      ]),

      currency: schema.string.optional(),
      language: schema.string.optional(),
      //promo code must be exactly 6 characters
      promo_code: schema.string.optional({ trim: true }, [
        rules.minLength(6),
        rules.maxLength(6),
      ]),

      is_agency: schema.boolean.optional(),
      is_email_verified: schema.boolean(),
      // is_agency_accept: schema.boolean(),
      custom_fields: schema.array.optional().anyMembers(),
    });
    const msg = {
      "email.required": "Email is required",
      "email.unique": "Email is already in use",
      "email.email": "Invalid email address",
      "password.required": "Password is required",
      "password.minLength": "Password must be at least 6 characters long",
      "password.maxLength":
        "Password must be at less or equal 16 characters long",
      "password_confirmation.confirmed":
        "Password and confirm password doesn't match",
      "currency.string": "Currency must be a string",
      "language.string": "Language must be a string",
      "promo_code.minLength": "Promo code must be exactly 6 characters long",
      "promo_code.maxLength": "Promo code must be exactly 6 characters long",
    };
    return await ctx.request.validate({ schema: userSchema, messages: msg });
  }
  public async validateLoginSchema(ctx: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        // rules.exists({ table: "users", column: "email", where: { active: 1 } }),
      ]),
      password: schema.string({ trim: true }),
      remember_me: schema.boolean.optional(),
    });
    const msg = {
      "email.required": "Email is required",
      "email.email": "Invalid email address",
      "email.exists": "Invalid credentials",
      "password.required": "Password is required",
      "password.string": "Password must be a string",
      "remember_me.boolean": "Remember me must be a boolean",
    };
    return ctx.request.validate({ schema: userSchema, messages: msg });
  }
  public async validatePasswordResetSchema(ctx: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.exists({ table: "users", column: "email", where: { active: 1 } }),
      ]),
    });
    const msg = {
      "email.required": "Email is required",
      "email.email": "Invalid email address",
      "email.exists": "Invalid credentials",
    };
    return ctx.request.validate({ schema: userSchema, messages: msg });
  }
  public async passwordSchema(ctx: HttpContextContract) {
    const passwordSchema = schema.create({
      token: schema.string(),
      password: schema.string([rules.minLength(6)]),
    });
    const msg = {
      "token.required": "Token is required",
      "password.required": "Password is required",
    };
    return ctx.request.validate({ schema: passwordSchema, messages: msg });
  }
  public async validateResendEmailByToken(ctx: HttpContextContract) {
    const resendEmailByTokenSchema = schema.create({
      token: schema.string([
        rules.exists({
          table: "tokens",
          column: "token",
          where: { type: "VERIFY_EMAIL" },
        }),
      ]),
    });
    return ctx.request.validate({
      schema: resendEmailByTokenSchema,
    });
  }
}

