import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhySection from './components/WhySection';
import Showcase from './components/Showcase';
import StatsSection from './components/StatsSection';
import Footer from './components/Footer';
import { SubmitRecordModal, VerifyReceiptModal } from './components/InteractiveDialogs';
import WrongNetworkModal from './components/WrongNetworkModal';
import VerificationPage from './pages/VerificationPage';

function useRoute() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, '', to);
  };

  return [route, navigate];
}

function App() {
  const [route, navigate] = useRoute();
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

  const isVerifyPage = route.startsWith('/verify');

  return (
    <div className="flex flex-col min-h-screen bg-[#050816] text-slate-300 relative overflow-x-hidden">
      
      {/* Premium Ambient Background Light Gradients */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[30%] left-[5%] w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Navigation */}
      <Navbar 
        onOpenSubmitModal={() => setSubmitModalOpen(true)} 
        currentRoute={route}
        onNavigate={navigate}
      />

      {/* Core Page Sections */}
      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          {isVerifyPage ? (
            <motion.div
              key="verify-route"
              initial={{ opacity: 0, y: 15, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(12px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <VerificationPage route={route} onNavigate={navigate} />
            </motion.div>
          ) : (
            <motion.div
              key="home-route"
              initial={{ opacity: 0, y: 15, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(12px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer currentRoute={route} onNavigate={navigate} />

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
          // Don't set selected record to null immediately, the modal now handles this internally to preserve exit animations safely
        }} 
        record={selectedRecord}
      />

      {/* Web3 Network Safety Check Overlay */}
      <WrongNetworkModal />

    </div>
  );
}

export default App;
