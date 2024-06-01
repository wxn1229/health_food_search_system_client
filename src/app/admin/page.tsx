import Header from "@/_components/Header/Header";
import AdminMain from "@/app/admin/AdminMain";
import UserMain from "@/app/user/settings/UserMain";

export default function AdminNamePage() {
  return (
    <div className="w-screen h-screen ">
      <div className="w-full h-full   flex flex-col">
        <Header></Header>
        <AdminMain></AdminMain>
      </div>
    </div>
  );
}
