import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Query {
    users: [User]
    user(_id: ID): User
    quotes: [Quote]
    iquotes(by: ID): [Quote]
  }

  type QuoteWithName {
    name: String
    by: IdName
  }

  type IdName {
    _id: String
    name: String
  }

  type User {
    _id: ID
    name: String
    email: String
    password: String
    quotes: [Quote]
  }

  type Quote {
    name: String
    by: ID
  }

  type Token {
    token: String
  }

  type Mutation {
    signUpUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): Token
    createQuote(name: String): String
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input UserSigninInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;
