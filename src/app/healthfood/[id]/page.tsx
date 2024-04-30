import Header from "@/_components/Header/Header";
import Main from "@/_components/Main/Main";
import IdMain from "./IdMain";

interface HealthFoodIdPageProps {
  params: { id: string };
}

export default function HealthFoodIdPage({ params }: HealthFoodIdPageProps) {
  return (
    <div className="w-full h-full  flex flex-col items-center">
      <Header></Header>
      {/* <Main></Main> */}
      <IdMain id={params.id}></IdMain>
    </div>
  );
}
