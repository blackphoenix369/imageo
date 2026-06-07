import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDB } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions:NextAuthOptions = {
    providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  }),
  DiscordProvider({
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!
  }),
  CredentialsProvider({
    name: "Credentials",
    credentials:{
      Email: {label:"email",type:"text"},
      Password: {label:"Password",type:"password"}
    },
    async authorize(credentials){
      if(!credentials?.Email || !credentials?.Password){
        throw new Error("Email or Password missing");
      }
      try {
        await connectToDB()
        const user = await User.findOne({email:credentials.Email})
        if(!user){
          throw new Error("User missing")
        }
        const isValid = await bcrypt.compare(
          credentials.Password, 
          user.password
        )
        if(!isValid){
          throw new Error("Password are not valid")
        }
        return {
          id: user._id.toString(),
          email: user.email
        }
      } catch (error) {
        console.log("Auth error:", error);
        throw error
      }
    }
  })
  ],
  callbacks:{
    async jwt({ token, user }) {
      
      return token
    },
    async session({session, token}){
      if(session.user){
        session.user.id = token.id as string
      }
      return session
  }
},
pages:{
  signIn:"/login",
  error:"/login",
},
session:{
  strategy: "database",
  maxAge: 30 * 24 * 60 * 60,
},
secret: process.env.NEXTAUTH_SECRET,
};