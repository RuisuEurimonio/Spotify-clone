import {User} from "@supabase/auth-helpers-nextjs"
import {
    useSessionContext,
    useUser as useSupaUser
} from "@supabase/auth-helpers-react"
import { createContext, useEffect, useState } from "react";

import { Subscription, UserDetails } from "@/types";

type UserContextType={
    accessToken: string | null,
    user: User | null; 
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
}

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export interface Props{
    [PropName:string]:any;
};

export const MyUserContextProvider=(props: Props)=>{
    const{
        session,
        isLoading: isLoadingUser,
        supabaseClient: supabase
    } = useSessionContext();
    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const getUserDetail = () => supabase.from("user").select("*").single();
    const getSubscription = () => supabase.from("subscription").select("*, prices(*, products(*))").in("status",["trialing", "active"]).single();

    useEffect(()=>{
        if (user && !isLoadingData && !userDetails && !subscription){
            setIsLoadingData(true)

            Promise.allSettled([getUserDetail(), getSubscription()]).then(
                (results) => {
                    const userDetailPromise = results[0];
                    const subscriptionsPromise = results[1];

                    if(userDetailPromise.status == "fulfilled"){
                        setUserDetails(userDetailPromise.value.data as UserDetails);
                    }

                    if(subscriptionsPromise.status == "fulfilled"){
                        setSubscription(subscriptionsPromise.value.data as Subscription);
                    }

                    setIsLoadingData(false);
                }
            )
        }
        else if (!user && !isLoadingData && !isLoadingUser){
            setUserDetails(null);
            setSubscription(null)
        }
    }, [user, isLoadingUser])   

    const value={
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    return <UserContext.Provider value={value} {...props}/>

}