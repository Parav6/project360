"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import axios from "axios";
import { addUser } from "@/lib/features/project360/userSlice";



const useUserHook = () => {
    const user = useAppSelector((state)=>state.user.currentUser);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(!user);
    const [error, setError] = useState("");

    useEffect(()=>{
        const fetchUser = async () => {
            try {
                console.log("Fetching user data...");
                const res = await axios.get('/api/me');
                console.log(1)
                console.log("user data", res.data.data);
                console.log(1)
                dispatch(addUser(res.data.data));
            } catch (error) {
                setError(`User fetch failed , ${error}`);
            }finally{
                setLoading(false);
            }
        };

        if (!user) {
            fetchUser();
        } else {
            setLoading(false);
        }
    },[]);

    return { user, loading, error };
};

export default useUserHook;