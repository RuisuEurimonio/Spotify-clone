"use client"

import MediaItem from "@/components/MediaItem";
import { Song } from "@/types";
import LikedButton from "./LikedButton";
import useOnPlay from "@/hooks/useOnPlay";

interface SearchContentProps {
    songs: Song[];
}

const SearchContent : React.FC<SearchContentProps> = ({
    songs
}) =>{

    const onPlay = useOnPlay(songs);

    if(songs.length === 0 ){
        return(
        <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400"> 
            No songs found.
        </div>
    )}

    return(
        <div className="flex flex-col gap-y-2 w-full px-6">
            {songs.map((data)=>(
                <div
                    key={data.id}
                    className="flex items-center gap-x-4 w-full"
                >
                    <div className="flex-1">
                        <MediaItem
                            onClick={(id:string)=>{onPlay(id)}}
                            data={data}
                        />
                    </div>
                    <LikedButton songId={data.id}/>
                </div>
            ))}
        </div>
    )
}

export default SearchContent;