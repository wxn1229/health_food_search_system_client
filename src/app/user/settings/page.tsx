import Header from "@/_components/Header/Header";
import UserMain from "@/app/user/settings/UserMain";

export default function userNamePage() {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full  flex flex-col">
        <Header></Header>
        <UserMain></UserMain>
      </div>
    </div>
  );
}
