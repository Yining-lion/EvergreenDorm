import Header from "../components/Header";
import Footer from "../components/Footer";
import EnvironmentContent from "./components/EnvironmentContent";

export default function EnvironmentPage() {
  return (
    <div className="relative min-h-screen">
      <Header />
      <EnvironmentContent />
      <Footer roofBgColor="bg-primary-pink"/>
    </div>
  );
}
