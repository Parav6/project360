"use client";

import { useAppSelector } from "@/lib/hooks";



export default function SignUp (){
    const user = useAppSelector((state)=>state.user.currentUser);
    console.log(user)
  
    return(
        <>
            <h1 className="text-white">SignUp</h1>
        </>
    )
}
