"use client"

import uniqid from "uniqid";
import {useState} from "react"
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const UploadModal = () =>{

    const [isLoading, setIsLoading] = useState(false);
    const {user} = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter()

    const uploadModal = useUploadModal();
    const {register, handleSubmit, reset} = useForm<FieldValues>({
        defaultValues:{
            author:'',
            title: '',
            song: null,
            image: null
        }
    })

    const onChange= (open : boolean)=>{
        if(!open){
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) =>{
        try{
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if(!imageFile || !songFile || !user){
                toast.error("Missing fields")
                return
            }

            const uniqueID = uniqid();
            //Upload song
            const {
                data: songData,
                error: songError
            } = await supabaseClient
                .storage
                .from("songs")
                .upload(`song-${values.title}-${uniqueID}`,songFile,{
                    cacheControl:'3600',
                    upsert: false
                })

                if(songError){
                    setIsLoading(false);
                    return toast("Failed song upload")
                }

            //Upload image    
            const {
                data: imageData,
                error: imageError
            } = await supabaseClient
                .storage
                .from("images")
                .upload(`image-${values.title}-${uniqueID}`,imageFile,{
                    cacheControl:'3600',
                    upsert: false
                })

                console.log(user);

                if(imageError){
                    setIsLoading(false);
                    return toast("Failed image upload")
                }

                const {
                    error: supabaseError
                } = await supabaseClient
                .from("songs")
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    song_path: songData.path
                })

                if(supabaseError){
                    setIsLoading(false);
                    return toast.error(supabaseError.message);
                }

                router.refresh();
                setIsLoading(false);
                toast.success("Song created")
                reset();
                uploadModal.onClose();
        } catch(error){
            toast.error("Something went wrong");
        } finally{
            setIsLoading(false);
        }
    }

    return(
        <Modal
            title="upload modal title"
            description="upload modal description"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-3"
            >
                <Input 
                    id="title"
                    disabled={isLoading}
                    {...register('title',{ required : true })}
                    placeholder="Song title"
                >
                </Input>
                <Input 
                    id="author"
                    disabled={isLoading}
                    {...register('author',{ required : true })}
                    placeholder="Author title"
                >
                </Input>
                <div>
                    <div>
                        Select a song file
                    </div>
                    <Input 
                    id="song"
                    type="file"
                    accept=".mp3"
                    disabled={isLoading}
                    {...register('song',{ required : true })}
                >
                </Input>
                </div>
                <div>
                    <div>
                        Select a song image
                    </div>
                    <Input 
                    id="image"
                    type="file"
                    accept="image/*"
                    disabled={isLoading}
                    {...register('image',{ required : true })}
                >
                </Input>
                </div>
                <Button disabled={isLoading} type="submit">
                    Create
                </Button>
            </form>
        </Modal>
    )
}

export default UploadModal;