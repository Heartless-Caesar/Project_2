import { CreateUserInput, LoginInput, UserModel } from "../schemas/user.schema";
import context from "../types/context";

class UserService {
  async createUser(input: CreateUserInput) {
    //Call user model to create user
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: context) {
    //Get user by email
    const user = await UserModel.find().findByEmail(input.email).lean();

    //Validate password

    //Sign jwt

    //Set jwt cookie

    //Return jwt
  }
}

export default UserService;
