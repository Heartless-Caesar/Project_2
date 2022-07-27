import express from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./resolvers";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { connectToMongo } from "./utils/mongo";

dotenv.config();

const booststrap = async () => {
  //Build schema
  const schema = await buildSchema({
    resolvers,
    //authChecker,
  });
  //Init Express
  const app = express();
  app.use(cookieParser());
  //Create Apollo server
  const server = new ApolloServer({
    schema,
    context: (ctx) => {
      return ctx;
    },
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();

  //Apply middleware to server
  server.applyMiddleware({ app });
  //app.listen to server
  app.listen({ port: 4000 }, () => {
    console.log("App is listening on port 4000");
  });
  //Connect to db
  connectToMongo();
};

booststrap();
