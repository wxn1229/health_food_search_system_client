import Header from "@/_components/Header/Header";
import IdMain from "./IdMain";
import { Comment } from "@/components/comment";
import { Card, CardBody } from "@nextui-org/react";

interface HealthFoodIdPageProps {
  params: { id: string };
}

export default function HealthFoodIdPage({ params }: HealthFoodIdPageProps) {
  return (
    <div className="w-full h-full  flex flex-col items-center">
      <Header></Header>

      <IdMain id={params.id}></IdMain>
      <Card className="w-[70%]">
        <CardBody>
          <Comment></Comment>
        </CardBody>
      </Card>
    </div>
  );
}
