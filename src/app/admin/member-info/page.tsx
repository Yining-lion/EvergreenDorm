import HeaderAdmin from "../components/HeaderAdmin";
import Sidebar from "../components/Sidebar";
import MemberInfo from "./components/MemberInfo";
import AdminRouter from "@/app/auth/AdminRoute"

export default function Home() {
  return (
    <AdminRouter>
      <div className="flex flex-col min-h-screen">
        <HeaderAdmin />
        <div className="flex">
          <Sidebar />
          <div className="bg-admin-gray w-full p-10">
            <MemberInfo />
          </div>
        </div>
      </div>
    </AdminRouter>

  );
}
