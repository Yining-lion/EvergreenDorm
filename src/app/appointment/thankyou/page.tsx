import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Thankyou from "./components/Thankyou";


export default function AppointmentForm() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <Thankyou />
      <main className="flex-grow bg-primary-pink"></main>
      <Footer roofBgColor="bg-primary-pink"/>
    </div>
  );
}
