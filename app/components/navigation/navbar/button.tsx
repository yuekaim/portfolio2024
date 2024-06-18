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
    {isOpen ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M12 2v20m-10-10h20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg> 
    : '👀'}
  </div>;
  
};

export default Button;