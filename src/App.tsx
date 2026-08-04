import React from "react";
import { AppProvider } from "./context/AppContext";
import { useApp } from "./context/useApp";
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
  const { activePanel, closePanel } = useApp();

  return (
    <Background>
      {activePanel && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-slate-950/20 backdrop-blur-[1px] sm:bg-transparent sm:backdrop-blur-none"
          onClick={closePanel}
          aria-label="Sluit geopend paneel"
        />
      )}

      <header className="fixed inset-x-0 top-0 z-50 flex justify-end p-3 sm:p-5">
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/15 bg-slate-950/30 p-1.5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <span className="hidden px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40 sm:inline">
            Labo 3
          </span>
          <Dashboard />
          <Chat />
          <Settings />
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 pb-8 pt-24 sm:px-6 sm:pb-12 sm:pt-28">
        <div className="w-full max-w-md">
          <GlassCard>
            <Header />
            <Loading />
            <Footer />
          </GlassCard>
        </div>
      </main>
    </Background>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="mt-7 border-t border-white/10 pt-5 text-center sm:mt-9 sm:pt-6">
      <div className="flex items-center justify-center gap-2 text-[11px] text-white/35">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]" />
        <span>Built for Labo 3</span>
      </div>
    </footer>
  );
};

export default App;
