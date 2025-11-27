import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import HeroSlider from "@/Components/Hero";
import LatestProducts from "@/Components/LatesProduct";
import CTABanner from "@/Components/CTABanner"; // new client-side CTA

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
    
      {/* Hero Section */}
      <HeroSlider />

      {/* CTA Banner (client) */}
      <CTABanner />

      {/* Latest Products */}
      <LatestProducts />

     
    </div>
  );
}
