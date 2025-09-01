import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  Image,
} from "@heroui/react";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import SideBar from "./SideBar";
import { useLocation } from "react-router-dom";

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
const location = useLocation()
useEffect(()=>{
    setIsOpen(false)
},[location])
  return (
    <div dir="rtl" className="w-full lg:hidden">
      {/* Navbar */}
      <Navbar
        isMenuOpen={isOpen}
        classNames={{base:" !bg-secondary/5"}}

        disableAnimation
        isBordered
      >
        <NavbarContent justify="start">
          {" "}
          <NavbarMenuToggle onClick={() => setIsOpen(!isOpen)} />
          <NavbarBrand>
            <Image className="w-28" src={logo} alt="Pargarx" />
          </NavbarBrand>
        </NavbarContent>
      </Navbar>

      {/* Sidebar (drawer style) */}
      {isOpen && (
        <div className="fixed top-0 right-0 flex-row-reverse inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar */}
          <SideBar close={false} />
        </div>
      )}
    </div>
  );
}
