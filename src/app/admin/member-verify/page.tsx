import HeaderAdmin from "../components/HeaderAdmin";
import Sidebar from "../components/Sidebar";
import AdminRouter from "@/app/auth/AdminRoute"
import MemberVerify from "./components/MemberVerify";

export default function Home() {
  return (
    <AdminRouter>
      <div className="flex flex-col min-h-screen">
        <HeaderAdmin />
        <div className="flex">
          <Sidebar />
          <div className="bg-admin-gray w-full p-10">
            <MemberVerify />
          </div>
        </div>
      </div>
    </AdminRouter>

  );
}
