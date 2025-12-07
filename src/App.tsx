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
      </GlassCard>
    </Background>
  );
}

export default App;
