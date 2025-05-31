import Header from "../components/Header";
import Footer from "../components/Footer";
import CatLogin from "./components/CatLogin";

export default function LoginPage() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <CatLogin />
      <main className="flex-grow bg-primary-pink"></main>
      <Footer roofBgColor="bg-primary-pink"/>
    </div>
  );
}
