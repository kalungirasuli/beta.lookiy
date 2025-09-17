import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import SupportForm from '@/components/SupportForm';

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {/* Support Form */}
        <SupportForm />
      </main>
      
      {/* Footer */}
      <Footer />      
    </div>
  );
}