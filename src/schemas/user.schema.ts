import {
  getModelForClass,
  Index,
  pre,
  prop,
  queryMethod,
  QueryMethod,
} from "@typegoose/typegoose";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";
import { AsQueryMethod, ReturnModelType } from "@typegoose/typegoose/lib/types";

function findUserByEmail(
  this: ReturnModelType<typeof User, QueryHelpers>,
  email: User["email"]
) {
  return this.findOne({ email });
}

interface QueryHelpers {
  findByEmail: AsQueryMethod<typeof findUserByEmail>;
}

//User schema
//Hashing the password before saving to DB
@pre<User>("save", async function () {
  //Checks is the password is being modified
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hashSync(this.password, salt);

  this.password = hashedPassword;
})
@ObjectType()
@Index({ email: 1 })
@queryMethod(findUserByEmail)
export class User {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  password: string;
}

//User model
export const UserModel = getModelForClass<typeof User, QueryHelpers>(User);

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @MaxLength(50, { message: "Password must be shorter than 50 characters" })
  password: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}