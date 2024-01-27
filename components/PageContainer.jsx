import { isLoggedIn } from "@/app/actions";
import { robotoMediumFont } from "@/app/fonts";
import { AuthContext } from "@/app/layout";
import { useContext, useEffect } from "react";

export default function PageContainer({children, className}) {
    const { user, setUser } = useContext(AuthContext);
    
    useEffect(()=>{
        const checkLogin = async ()=> {
            const logged = await isLoggedIn();
            const foundUser = JSON.parse(logged);
            if (foundUser.success && !user?._id) {
                setUser(foundUser);
            }else if (!foundUser.success && user?._id) {
                setUser({});
            }
        }
        checkLogin();
    }, []);
    return (
        <div className={`flex justify-center min-h-full w-full pt-2 ${robotoMediumFont.className} ${className}`}>{children}</div>
    )
}