import Header from "../components/Header";
import Footer from "../components/Footer";
import ChurchContent from "./components/ChurchContent";

export default function EnvironmentPage() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <ChurchContent />
      <main className="flex-grow bg-primary-pink"></main>
      <Footer roofBgColor="bg-primary-pink"/>
    </div>
  );
}
