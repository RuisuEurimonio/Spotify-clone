"use client"

import AuthModal from "@/components/AuthModal";
import SubscribeModal from "@/components/SubscribeModal";
import UploadModal from "@/components/uploadModal";
import { ProductWithPrices } from "@/types";
import { useEffect, useState } from "react"

interface ModalProviderProps{
    products: ProductWithPrices[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({
    products
}) =>{

    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    }, [])

    if(!isMounted){
        return null;
    }

    return(
        <>
            <AuthModal/>
            <UploadModal/>
            <SubscribeModal products={products} />
        </>
    )

}

export default ModalProvider;