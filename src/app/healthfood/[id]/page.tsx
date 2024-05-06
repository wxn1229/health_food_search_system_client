import Header from "@/_components/Header/Header";
import IdMain from "./IdMain";

interface HealthFoodIdPageProps {
  params: { id: string };
}

export default function HealthFoodIdPage({ params }: HealthFoodIdPageProps) {
  return (
    <div className="w-full h-full  flex flex-col items-center">
      <Header></Header>

      <IdMain id={params.id}></IdMain>
    </div>
  );
}
