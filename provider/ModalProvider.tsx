"use client"

import Modal from "@/components/Modal";
import { useEffect, useState } from "react"

const ModalProvider = () =>{

    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    }, [])

    if(!isMounted){
        return null;
    }

    return(
        <>
            <Modal isOpen title="test modal" description="test Description" onChange={()=>{}}>
                Test children
            </Modal>
        </>
    )

}

export default ModalProvider;