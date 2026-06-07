"use client"
import React,{useState} from "react";
import { useRouter } from "next/navigation";
import {signIn} from "next-auth/react"

function loginpage(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await signIn("Credentials",{
            email,
            password,
            redirect:false
        })

        if(result?.error){
            console.error(result.error)
        } else {
            router.push("/")
        } 
    }
    return <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
          />  
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> 
          <button type="submit">Login</button>
        </form>
        <div>
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
        <div>
            <button onClick = {() => signIn("google")}>Login with Google</button>
        </div>
        <div>
            <button onClick = {() => signIn("github")}>Login with Github</button>
        </div>
        <div>
            <button onClick = {() => signIn("discord")}>Login with Discord</button>
        </div>
    </div>
}

export default loginpage;