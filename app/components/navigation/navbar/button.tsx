import React from "react";
import { div } from "three/examples/jsm/nodes/Nodes";

const Button = (
  {
    toggle,
    isOpen,
  }:{
    toggle: () => void;
    isOpen: boolean;
  }
) => {
  return <div onClick={toggle} className="sm:visible text-6xl pl-8">
    {isOpen ? '👀' : 'x'}
  </div>;
  
};

export default Button;