"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";
import {FaPlay} from "react-icons/fa" 

interface ListItemProps{
    image: string,
    href: string
    name: string
}

const ListItem: React.FC<ListItemProps> = ({
    image,
    href,
    name
}) => {
    
    const router = useRouter();

const onClick = () =>{
    //add authentication before push
    router.push(href)
}

    return(
        <button
        onClick={onClick}
        className="
            relative
            group
            flex
            items-center
            rounded-md
            overflow-hidden
            gap-x-4
            bg-neutral-100/10
            hover:bg-neutral-100/20
            transition
            pr-4
        ">
            <div className="
                relative
                min-h-[64px]
                min-w-[64px]
            ">
                <Image
                    className="object-cover"
                    fill
                    src={image}
                    alt="Image"
                />
            </div>
            <p className="truncate font-medium py-5">
                {name}
            </p>
            <div className="
                absolute
                transition
                opacity-0
                rounded-full
                flex
                item-center
                justify-center
                bg-green-500
                p-4
                drop-shadow-md
                right-5
                group-hover:opacity-100
                hover:scale-100
            ">
                <FaPlay className="text-black"></FaPlay>
            </div>
        </button>
    )
}

export default ListItem;