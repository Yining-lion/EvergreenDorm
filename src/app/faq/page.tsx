import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQContent from "./components/FAQ";

export default function EnvironmentPage() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <FAQContent />
      <main className="flex-grow bg-primary-pink"></main>
      <Footer roofBgColor="bg-primary-pink"/>
    </div>
  );
}
