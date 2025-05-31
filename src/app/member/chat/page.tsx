import Header from "@/app/components/Header";
import Footer from"@/app/components/Footer";
import SubHeader from "../components/SubHeader";
import Chat from "./components/Chat";
import ProtectedRoute from "@/app/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <SubHeader />
        <Chat />
        <main className="flex-grow bg-primary-pink pb-30"></main>
        <Footer roofBgColor="bg-primary-pink"/>
      </div>
    </ProtectedRoute>

  );
}
