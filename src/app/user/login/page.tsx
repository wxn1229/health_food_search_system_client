import Header from "@/_components/Header/Header";
import LoginTab from "@/app/user/login/LoginTab";

export default function UserLoginPage() {
  return (
    <div className="w-full h-full  flex flex-col items-center">
      <Header></Header>
      <LoginTab></LoginTab>
    </div>
  );
}
