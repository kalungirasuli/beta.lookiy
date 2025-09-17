import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import ImmersiveHero from '@/components/ImmersiveHero';
import RealPeopleSection from '@/components/RealPeopleSection';
import MakeItMatterSection from '@/components/MakeItMatterSection';
import UseCasesSection from '@/components/UseCasesSection';
import JoinWaitingListForm from '@/components/JoinWaitingListForm';

export default function Homecoming() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {/* Immersive Hero Section */}
        <ImmersiveHero />
        
        {/* Real People Real Links Section */}
        <RealPeopleSection />
        
        {/* How You'll Make It Matter Section */}
        <MakeItMatterSection />
        
        {/* Use Cases Section */}
        <UseCasesSection />
        
        {/* Join Waiting List Form */}
        <JoinWaitingListForm />
      </main>
      
      {/* Footer */}
      <Footer />      
    </div>
  );
}