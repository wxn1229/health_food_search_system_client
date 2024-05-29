"use client";
import { useEffect, useState } from "react";
import { SearchSettingType } from "../../../types/SearchType";
import { Pagination } from "@nextui-org/react";
import { default as axios } from "../../../utils/axios";
import { SearchResultType } from "../../../types/SearchResultType";
import { useRouter } from "next/navigation";
import HfCard from "@/_components/Main/SearchResult/HfCard";
interface SearchResultPropsType {
  doSearch: SearchSettingType;
}

export default function SearchResult({ doSearch }: SearchResultPropsType) {
  const [searchResult, setSearchResult] = useState<SearchResultType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    router.push("/#");
  }, [page]);

  useEffect(() => {
    async function getSearchResult() {
      try {
        const result = await axios.post("/api/searching/multisearching", {
          ...doSearch,
          page: page,
        });
        console.log("🚀 ~ getSearchResult ~ result:", result);
        setSearchResult(result.data.results);
        setTotalPage(result.data.count);
      } catch (e) {
        console.log("🚀 ~ getSearchResult ~ e:", e);
      }
    }
    getSearchResult();
  }, [doSearch, page]);

  useEffect(() => {
    setPage(1);
    console.log("🚀 ~ SearchResult ~ doSearch:", doSearch);
  }, [doSearch]);
  useEffect(() => {
    console.log("🚀 ~ SearchResult ~ searchResult:", searchResult);
  }, [searchResult]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex-1 w-[90%] mt-4 gap-2 flex justify-around items-stretch  flex-wrap">
        {searchResult.length === 0 && <div>Not Found Result</div>}
        {searchResult.map((item, index) => (
          <HfCard key={item.Id} item={item}></HfCard>
        ))}
      </div>
      <Pagination
        className="my-10"
        showControls
        variant="faded"
        total={totalPage}
        page={page}
        onChange={setPage}
        initialPage={1}
      />
    </div>
  );
}
