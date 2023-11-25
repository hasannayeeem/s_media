import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Token from "./Token";

export default class User extends BaseModel {
  public serializeExtras = true;
  @column({ isPrimary: true })
  public id: number;

  @column()
  public full_name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public active: boolean;

  @column()
  public code: number;

  @column()
  public is_email_verified: boolean;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>;

  @hasMany(() => Token, {
    onQuery: (query) => query.where("type", "PASSWORD_RESET"),
  })
  public passwordResetTokens: HasMany<typeof Token>;

  @hasMany(() => Token, {
    onQuery: (query) => query.where("type", "VERIFY_EMAIL"),
  })
  public verifyEmailTokens: HasMany<typeof Token>;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
