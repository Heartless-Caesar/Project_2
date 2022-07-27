import { ApolloError } from "apollo-server-core";
import { CreateUserInput, LoginInput, UserModel } from "../schemas/user.schema";
import context from "../types/context";
import bcrypt from "bcrypt";
import { signJwt } from "../utils/jwt";

class UserService {
  async createUser(input: CreateUserInput) {
    //Call user model to create user
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: context) {
    const e = "Invalid udername or password";
    //Get user by email
    const user = await UserModel.find().findByEmail(input.email).lean();
    if (!user) {
      throw new ApolloError(e);
    }
    //Validate password
    const passwordValid = await bcrypt.compare(input.password, user.password);
    if (!passwordValid) {
      throw new ApolloError(e);
    }
    //Sign jwt
    const token = signJwt(user);
    //Set jwt cookie
    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10,
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    //Return jwt
    return token;
  }
}

export default UserService;
