import HeaderAdmin from "@/app/admin/components/HeaderAdmin";
import Sidebar from "@/app/admin/components/Sidebar";
import AdminRouter from "@/app/auth/AdminRoute"
import AddActivityImagePage from "./AddActivityImagePage";

export default function Home() {
  return (
    <AdminRouter>
      <div className="flex flex-col min-h-screen">
        <HeaderAdmin />
        <div className="flex">
          <Sidebar />
          <div className="bg-admin-gray w-full p-10">
            <AddActivityImagePage />
          </div>
        </div>
      </div>
    </AdminRouter>
  );
}
