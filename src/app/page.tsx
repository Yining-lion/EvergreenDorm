import Header from "./components/Header";
import MainBanner from "./components/MainBanner";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MainBanner />
      <main className="flex-grow mb-30"></main>
      <Footer />
    </div>
  );
}
