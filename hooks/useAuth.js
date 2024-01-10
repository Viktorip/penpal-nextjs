'use client'

import { verifyJwtToken } from "@/lib/auth";
import { jwtcookiename } from "@/utils/constants";
import { useEffect, useState } from "react"
import Cookies from "universal-cookie";



export function useAuth() {
    const [auth, setAuth] = useState(null);

    const getVerifiedToken = async () => {
        const cookies = new Cookies();
        const token = cookies.get(jwtcookiename) ?? null;
        console.log("useAuth got token:", token);
        const verifiedToken = await verifyJwtToken(token);
        setAuth(verifiedToken);
    }

    useEffect(()=>{
        getVerifiedToken();
    }, []);
    
    return true;
}