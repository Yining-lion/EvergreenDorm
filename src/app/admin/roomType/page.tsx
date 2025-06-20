import HeaderAdmin from "../components/HeaderAdmin";
import RoomStats from "./components/RoomStats";
import Sidebar from "../components/Sidebar";
import AdminRouter from "@/app/auth/AdminRoute"

export default function Home() {
  return (
    <AdminRouter>
      <div className="flex flex-col min-h-screen bg-admin-gray">
        <HeaderAdmin />
        <div className="flex">
          <div className="hidden lg:flex">
            <Sidebar />
          </div>
          <div className="bg-admin-gray w-full p-10">
            <RoomStats />
          </div>
        </div>
      </div>
    </AdminRouter>
  );
}
