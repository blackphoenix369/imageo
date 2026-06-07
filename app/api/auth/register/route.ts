import {NextResponse,NextRequest} from "next/server";
import {connectToDB} from "@/utils/db";
import User from "@/models/User";


export async function POST(next:NextRequest) {
    try{
        const {email, password} = await next.json()

        if(!email || !password){
            return NextResponse.json(
                {error: "Email and password are required"}, 
                {status: 400}
            )
        }

        await connectToDB();

        const existingUser = await User.findOne({email});

        if(existingUser){
            return NextResponse.json(
                {error:"User already registered"},
                {status:400}
            );
        }

        await User.create({
            email,
            password
        })

        return NextResponse.json(
            {message:"User successfully registered"},
            {status:200}
        )

    } catch(error){
        console.error("Error registering user:", error);
        return NextResponse.json(
            {error:"Failed to register user"},
            {status:400}
        );
    }
}