import Header from "@/_components/Header/Header";
import FavResult from "@/app/favorite/FavResult";

export default function FavoritePage() {
  return (
    <div className="w-full h-full flex flex-col items-center ">
      <Header></Header>
      <FavResult></FavResult>
    </div>
  );
}
