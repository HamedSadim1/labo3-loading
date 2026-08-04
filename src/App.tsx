import React from "react";
import { AppProvider } from "./context/AppContext";
import Background from "./components/Background";
import GlassCard from "./components/GlassCard";
import Header from "./components/Header";
import Loading from "./components/Loading";
import Settings from "./components/Settings";
import Chat from "./components/Chat";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const AppContent: React.FC = () => {
  return (
    <Background>
      {/* Top bar with controls - responsive */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2 z-50 animate-fade-in">
        <Dashboard />
        <Chat />
        <Settings />
      </div>

      {/* Main content - responsive padding and sizing */}
      <div className="w-full max-w-sm sm:max-w-md px-4">
        <GlassCard>
          <Header />
          <Loading />
          <Footer />
        </GlassCard>
      </div>
    </Background>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 animate-fade-in [animation-delay:0.6s]">
      <p className="text-white/30 text-xs text-center">
        Gebouwd met React + Tailwind CSS
      </p>
    </footer>
  );
};

export default App;
