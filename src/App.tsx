import React from "react";
import { AppProvider } from "./context/AppContext";
import Background from "./components/Background";
import GlassCard from "./components/GlassCard";
import Header from "./components/Header";
import Loading from "./components/Loading";
import Settings from "./components/Settings";
import Chat from "./components/Chat";
import Dashboard from "./components/Dashboard";
import { APP_NAME, FOOTER_COPY } from "./constants/app";

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
      <header
        id="app-header"
        className="fixed inset-x-0 top-0 z-50 flex justify-end p-[max(0.75rem,env(safe-area-inset-top))] sm:p-5"
      >
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/15 bg-slate-950/40 p-1.5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <span className="hidden px-2 text-xs font-medium uppercase tracking-[0.18em] text-white/75 sm:inline">
            {APP_NAME}
          </span>
          <Dashboard />
          <Chat />
          <Settings />
        </div>
      </header>

      <main className="relative z-10 flex min-h-svh w-full items-center justify-center px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-24 sm:px-6 sm:pb-12 sm:pt-28">
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
      <div className="flex items-center justify-center gap-2 text-xs text-white/70">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]" />
        <span>{FOOTER_COPY}</span>
      </div>
    </footer>
  );
};

export default App;
