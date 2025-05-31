import Header from "../components/Header";
import Footer from "../components/Footer";
import Guidelines from "./components/Guidelines";

export default function AppointmentGuidelines() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <Guidelines />
      <main className="flex-grow bg-primary-pink"></main>
      <Footer roofBgColor="bg-primary-pink"/>
    </div>
  );
}
