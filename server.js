import { ApolloServer, gql } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageDisabled,
} from "apollo-server-core";
import { quotes, users } from "./fakedb.js";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import { MONGO_URL } from "./config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import typeDefs from "./schemaGql.js";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from 'path'
const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 4000;
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mogodb");
});

mongoose.connection.on("connected", (error) => {
  console.log("error to mogodb", error);
});

//model import here
import "./Quotes.js";
import "./User.js";

import resolvers from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { authorization } = req.headers.authorization || "";
    console.log("here error ", authorization);
    if (authorization) {
      const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
      return { userId };
    }
  },
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    process.env.NODE_ENV !== "production"
      ? ApolloServerPluginLandingPageGraphQLPlayground()
      : ApolloServerPluginLandingPageDisabled,
  ],
});
// app.get('*',(req,res)=>{
//   res.send("boom!!")
// })

if(process.env.NODE_ENV == "production"){
  app.use(express.static('client-app/build'))
  // const path = require('path');
  app.get('*',(req,res)=>{
    // res.send("boom!!")
    res.sendFile(path.resolve(__dirname,'client-app','build','index.html'))
  })
}

await server.start();
server.applyMiddleware({ 
  app ,
  path:'/graphql'
});

httpServer.listen({ port: port }, ()=>{
  console.log(`server ready  ${server.graphqlPath }`);
})

// server.listen().then(({ url }) => {
//   console.log(`hello ${url}`);
// });
