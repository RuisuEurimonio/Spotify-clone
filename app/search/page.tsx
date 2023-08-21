import getSongsByTitle from "@/actions/getSongByTitle"
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";


interface SearchProps {
    searchParams: {
        title: string
    }
}

export const revalidate = 0;

const searchPage = async ({searchParams}: SearchProps) =>{

    const songs = await getSongsByTitle(searchParams.title);

    return(
        <div className="
            bg-neutral-900
            rounded-lg
            w-full
            h-full
            overflow-hidden
            overflow-y-auto
        ">
            <Header className="from-bg-neutral-900">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-while text-3xl font-semibold">
                        Search
                    </h1>
                    <SearchInput></SearchInput>
                </div>
            </Header>
            <SearchContent songs={songs}/>

        </div>
    )

}

export default searchPage;