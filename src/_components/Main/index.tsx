import Search from "./Search";
import SearchResult from "./SearchResult";

export default function Main() {
  return (
    <div className="flex flex-col items-center flex-1 py-2 w-full">
      <h2>Main</h2>
      <Search></Search>
      <SearchResult></SearchResult>
    </div>
  );
}
