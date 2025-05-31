import Header from "../components/Header";
import Footer from "../components/Footer";
import Profile from "./components/Profile";
import SubHeader from "./components/SubHeader";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Header />
        <SubHeader />
        <Profile />
        <main className="flex-grow bg-primary-pink pb-30"></main>
        <Footer roofBgColor="bg-primary-pink"/>
      </div>
    </ProtectedRoute>

  );
}
