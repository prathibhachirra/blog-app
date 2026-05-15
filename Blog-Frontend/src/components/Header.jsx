import React from "react";
import { NavLink } from "react-router";

function Header() {

  const navStyles = ({ isActive }) =>
    `px-5 py-2 rounded-xl font-semibold transition-all duration-300
    ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
    }`;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <div>
          <h1 className="text-3xl font-bold text-blue-700 tracking-wide">
            My Blog
          </h1>
        </div>

        {/* Nav Links */}
        <ul className="flex items-center gap-5">
          <li>
            <NavLink to="/home" className={navStyles}>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/register" className={navStyles}>
              Register
            </NavLink>
          </li>

          <li>
            <NavLink to="/login" className={navStyles}>
              Login
            </NavLink>
          </li>
        </ul>

      </nav>
    </header>
  );
}

export default Header;
