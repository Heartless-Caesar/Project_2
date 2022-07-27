import { Request, Response } from "express";
import { User } from "../schemas/user.schema";

interface context {
  req: Request;
  res: Response;
  user: User;
}

export default context;
