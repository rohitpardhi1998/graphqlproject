import {quotes,users} from './fakedb.js'
import {randomBytes} from 'crypto'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config.js';

const User  = mongoose.model("User")
const Quote = mongoose.model("Quote")


const resolvers = {
    Query: {
      // greet:()=>{
      //     return "hello";
      // }
      // this is code for local user data fech 

    //   users: () => users,
    //   user: (_, { _id }) => users.find((user) => user._id == _id),
    //   quotes: () => quotes,
    //   iquotes: (_, { by }) => quotes.filter((quote) => quote.by == by),

      //local user data fetch end 
      
      // data fetch from mongodb server

      users: async() => await User.find({}),
      user:async (_, { _id }) => await User.findOne({_id}),
      quotes: async() => await Quote.find({}).populate("by","_id name"),
      iquotes: (_, { by }) => Quote.find({by}),
      // myprofile:async(_,args,{userId})=>{
      //   // if(!userId){
      //   //   throw new Error("uou must logged im")
      //   // }
      // return await User.findOne({_id:userId})
         
      // }
    },
    User: {
      quotes:async (ur) => await Quote.find({by:ur._id}),
    },
    Mutation: {
      signUpUser: async (_, { userNew }) => {
        //   const _id = randomBytes(5).toString("hex")
        //   users.push({
        //     _id: _id,
        //    ...userNew
        //   });
        //   return users.find((user) => user._id == _id);
        const auser = await User.findOne({ email: userNew.email });
        if (auser) {
          throw new Error("user is alredy exist with that email");
        }
        const hashpassword = await bcrypt.hash(userNew.password, 12);
  
        const newUser = new User({
          ...userNew,
          password: hashpassword,
        });
        return await newUser.save();
      },

  
      signinUser: async (_, { userSignin }) => {
        const user = await User.findOne({ email: userSignin.email });
        if (!user) {
          throw new Error("user does not exist ");
        }
        const domatch = await bcrypt.compare(userSignin.password, user.password);
        if (!domatch) {
          throw new Error("email and password are invalid");
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return { token };
      },
  

      createQuote: async (_, { name }, { userId }) => {
        // if (!userId) {
        //   throw new Error("you mustn");
        // }

        const newQuote = new Quote({
          name,
          by: userId,
        });
        await newQuote.save();
        return "quote saved succesfully "
      },
    },
  };
  

export default resolvers;