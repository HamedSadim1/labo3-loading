import React from "react";
import { APP_TITLE } from "../constants/app";

const Header: React.FC = () => {
  return (
    <h1 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
      {APP_TITLE}
    </h1>
  );
};

export default Header;
