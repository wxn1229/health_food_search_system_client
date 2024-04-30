import Header from "@/_components/Header/Header";
import Main from "@/_components/Main/Main";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center ">
      <Header></Header>
      <Main></Main>
    </div>
  );
}
