import React from "react";
import Background from "./components/Background";
import GlassCard from "./components/GlassCard";
import Header from "./components/Header";
import Loading from "./components/Loading";

function App() {
  return (
    <Background>
      <GlassCard>
        <Header />
        <Loading />
        <Footer />
      </GlassCard>
    </Background>
  );
}

const Footer: React.FC = () => {
  return (
    <footer className="mt-8 pt-6 border-t border-white/10 animate-fade-in [animation-delay:0.6s]">
      <p className="text-white/30 text-xs">Gebouwd met React + Tailwind CSS</p>
    </footer>
  );
};

export default App;
