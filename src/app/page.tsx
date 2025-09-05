import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <Hero />
      </main>
      
      {/* Footer */}
      <Footer />      
    </div>
  );
}
