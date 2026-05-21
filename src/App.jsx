import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhySection from './components/WhySection';
import Showcase from './components/Showcase';
import StatsSection from './components/StatsSection';
import Footer from './components/Footer';
import { SubmitRecordModal, VerifyReceiptModal } from './components/InteractiveDialogs';
import WrongNetworkModal from './components/WrongNetworkModal';

function App() {
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Dynamic list of user submitted records
  const [userRecords, setUserRecords] = useState([]);

  // Handler to add a newly created user record to the Showcase registry list
  const handleRecordSubmit = (newRecord) => {
    setUserRecords((prev) => [newRecord, ...prev]);
  };

  // Handler to open the verification proof modal
  const handleVerifyClick = (record) => {
    setSelectedRecord(record);
    setVerifyModalOpen(true);
  };

  // Handler to scroll down to showcase section
  const handleScrollToShowcase = () => {
    const showcaseElement = document.getElementById('showcase');
    if (showcaseElement) {
      showcaseElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050816] text-slate-300 relative">
      
      {/* Premium Ambient Background Light Gradients */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[30%] left-[5%] w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Navigation */}
      <Navbar onOpenSubmitModal={() => setSubmitModalOpen(true)} />

      {/* Core Page Sections */}
      <main className="flex-grow">
        
        {/* 1. Hero Section */}
        <Hero 
          onOpenSubmit={() => setSubmitModalOpen(true)} 
          onScrollToShowcase={handleScrollToShowcase} 
        />

        {/* 2. Why Section */}
        <WhySection />

        {/* 3. ESG Record Showcase */}
        <Showcase 
          recordsList={userRecords} 
          onVerifyClick={handleVerifyClick} 
        />

        {/* 4. Global Impact Stats Section */}
        <StatsSection />

      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <SubmitRecordModal 
        isOpen={submitModalOpen} 
        onClose={() => setSubmitModalOpen(false)} 
        onSubmitSuccess={handleRecordSubmit}
      />

      <VerifyReceiptModal 
        isOpen={verifyModalOpen} 
        onClose={() => {
          setVerifyModalOpen(false);
          setSelectedRecord(null);
        }} 
        record={selectedRecord}
      />

      {/* Web3 Network Safety Check Overlay */}
      <WrongNetworkModal />

    </div>
  );
}

export default App;
