import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { string } from "@ioc:Adonis/Core/Helpers";
import User from "./User";

type TokenType = "PASSWORD_RESET";

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number | null;

  @column()
  public type: string;

  @column()
  public token: string;

  @column.dateTime()
  public expires_at: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;


  public static async generatePasswordResetToken(user: User | null) {
    const token = string.generateRandom(64);
    const d = DateTime.now().plus({ hour: 1 }).toFormat("yyyy-MM-dd HH:mm:ss");
    if (!user) return token;
    const record = await user.related("tokens").create({
      type: "PASSWORD_RESET",
      expires_at: d,
      token,
    });
    return record.token;
  }

  public static async expireTokens(
    user: User,
    relationName: "passwordResetTokens"
  ) {
    await user
      .related(relationName)
      .query()
      .update({
        expires_at: DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss"),
      });
  }
  public static async getTokenUser(token: string, type: TokenType) {
    const record = await Token.query()
      .preload("user", (q) => q.preload("profile"))
      .where("token", token)
      .where("type", type)
      .where("expires_at", ">", DateTime.now().toSQL())
      .orderBy("created_at", "desc")
      .first();

    return record?.user ? record.user : null;
  }

  public static async verify(token: string, type: TokenType) {
    const record = await Token.query()
      .where("expires_at", ">", DateTime.now().toSQL())
      .where("token", token)
      .where("type", type)
      .first();
    return !!record;
  }
}
