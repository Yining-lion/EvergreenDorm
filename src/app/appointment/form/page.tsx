import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Form from "./components/Form";


export default function AppointmentForm() {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Header />
      <Form />
      <main className="flex-grow bg-primary-pink"></main>
      <Footer roofBgColor="bg-primary-pink"/>
    </div>
  );
}
