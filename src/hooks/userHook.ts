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

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/me');
            dispatch(addUser(res.data.data));
        } catch (error) {
            setError(`User fetch failed , ${error}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    return { user, loading, error, refetch: fetchUser };
};

export default useUserHook;