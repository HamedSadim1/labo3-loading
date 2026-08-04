import React from "react";
import { useApp } from "../context/useApp";
import { APP_DESCRIPTION, APP_TITLE, APP_VERSION } from "../constants/app";
import Icon from "./Icon";

const Header: React.FC = () => {
  const { loading } = useApp();
  const statusLabel = loading.status === "running" ? "Bezig" : "Klaar";
  const statusClass =
    loading.status === "running" ? "bg-amber-300" : "bg-cyan-300";

  return (
    <header className="mb-8 animate-slide-up sm:mb-10">
      <div className="mb-5 flex items-center justify-between text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
          <span
            className={`h-1.5 w-1.5 rounded-full ${statusClass} shadow-[0_0_10px_rgba(103,232,249,0.9)]`}
          />
          <span role="status">{statusLabel}</span>
        </div>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/75">
          {APP_VERSION}
        </span>
      </div>

      <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-linear-to-br from-cyan-300/20 to-violet-400/20 text-cyan-100 shadow-lg shadow-cyan-950/20 sm:h-20 sm:w-20">
        <Icon name="bolt" className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
        <span className="bg-linear-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
          {APP_TITLE}
        </span>
      </h1>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/75 sm:text-base">
        {APP_DESCRIPTION}
      </p>
    </header>
  );
};

export default Header;
