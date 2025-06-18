import Header from "../components/Header";
import Footer from "../components/Footer";
import CatSignup from "./components/CatSignup";

export default function SignupPage() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <CatSignup />
      {/* <main className="flex-grow bg-primary-pink"></main> */}
      <Footer roofBgColor="bg-primary-pink"/>
    </div>
  );
}
