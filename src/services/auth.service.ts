import { db } from "@/config/database";
import { userTable } from "@/db-schema";
import { InvalidContentError } from "@/libs/error";
import {
  GetProfileParams,
  LoginParams,
  RegisterParams,
  UserData,
} from "@/models/auth.model";
import { eq } from "drizzle-orm";

export default abstract class AuthService {
  static async login(params: LoginParams) {
    const { email, password } = params;

    const result = await db.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!result) {
      throw new InvalidContentError("Email or password not correct!");
    }

    const isMatchPassword = await Bun.password.verify(
      password,
      result.password
    );

    if (!isMatchPassword) {
      throw new InvalidContentError("Email or password not correct!");
    }

    const data = { ...result } as WithOptional<UserData, "password">;

    delete data.password;

    return data;
  }

  static async register(params: RegisterParams) {
    const { email, password, username } = params;

    const bcryptHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: Number(process.env.PASSWORD_HASH_CODE ?? 4),
    });

    const results = await db
      .insert(userTable)
      .values({
        username: username,
        email: email,
        password: bcryptHash,
      })
      .returning();

    const data = { ...results[0] } as WithOptional<UserData, "password">;

    delete data.password;

    return data;
  }

  static async getProfile(params: GetProfileParams) {
    const { userId } = params;

    const result = await db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
    });

    const data = { ...result } as WithOptional<UserData, "password">;

    delete data.password;

    return data;
  }
}
