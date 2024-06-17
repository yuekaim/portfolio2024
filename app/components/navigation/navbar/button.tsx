import React from "react";

const Button = (
  {
    toggle,
    isOpen,
  }:{
    toggle: () => void;
    isOpen: boolean;
  }
) => {
  return <div style={{ opacity: `${isOpen ? 0 : 1}` }}onClick={toggle} className="sm:invisible">
    button
  </div>;
};

export default Button;