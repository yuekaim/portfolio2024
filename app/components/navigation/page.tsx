"use client";

import { useState } from "react";
import Navbar from "./navbar";
import Categories from "./categories";
import React from "react";
import { Suspense } from "react";


const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      {/* <Suspense fallback={null}>
        <Categories isOpen={isOpen} toggle={toggle}/>
      </Suspense> */}
      <Navbar isOpen={isOpen} toggle={toggle} />
    </>
  );
};

export default Navigation;