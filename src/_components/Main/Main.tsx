"use client";
import { useState } from "react";
import Search from "./Search";
import SearchResult from "./SearchResult/SearchResult";
import { InitSearchSetting, SearchSettingType } from "../../types/SearchType";

export default function Main() {
  const [doSearch, setDoSearch] =
    useState<SearchSettingType>(InitSearchSetting);

  function sendSearchSetting(searchSetting: SearchSettingType) {
    setDoSearch(searchSetting);
  }

  return (
    <div className="flex flex-col items-center flex-1 py-2 w-full">
      <Search sendSearchSetting={sendSearchSetting}></Search>
      <SearchResult doSearch={doSearch}></SearchResult>
    </div>
  );
}
