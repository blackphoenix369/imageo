"use client"
import { useRouter } from "next/navigation";
import React, { ReactEventHandler, useState } from "react";

function registerpage(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [conformPassword,setConformPassword] = useState("");
    const router = useRouter();
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        if(password!==conformPassword){
            alert("Password does not match")
            return;
        } 
        try {
            const res = await fetch("/api/auth/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({email,password})
            })
            const data = await res.json();
            if(!res.ok){
               throw new Error(data.error || "Registration failed")
            }
            console.log(data)
            router.push("/login")
        } catch (error) {
            console.error(error)
        }
    }
    return <div>
        <h1>Register</h1>
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
            <input
                type="password"
                placeholder="Confirm Password"
                value={conformPassword}
                onChange={(e) => setConformPassword(e.target.value)}
            />
            <button type="submit">Register</button>
        </form>
        <div>
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    </div>
    
}

export default registerpage;