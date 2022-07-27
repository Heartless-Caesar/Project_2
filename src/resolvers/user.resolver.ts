import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CreateUserInput, LoginInput, User } from "../schemas/user.schema";
import UserService from "../service/user.service";
import context from "../types/context";

@Resolver()
export default class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => User)
  createUser(@Arg("input") input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => String)
  login(@Arg("input") input: LoginInput, @Ctx() context: context) {
    return this.userService.login(input);
  }

  @Query(() => User)
  me() {
    return {
      _id: 123,
      name: "John Does",
      email: "johndoe@email.com",
    };
  }
}
