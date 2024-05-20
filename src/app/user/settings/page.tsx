import Header from "@/_components/Header/Header";
import UserMain from "@/app/user/settings/UserMain";

interface UserNamePageProps {
  params: { user_name: string };
}

export default function userNamePage({ params }: UserNamePageProps) {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full  flex flex-col">
        <Header></Header>
        <UserMain user_name={params.user_name}></UserMain>
      </div>
    </div>
  );
}
