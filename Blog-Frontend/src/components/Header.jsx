import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

function Header() {
  const { currentUser, userAuthenticate, logout } = useAuth();
  const navigate = useNavigate();

  const navStyles = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
    ${
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
    }`;

  const dashboardPath =
    currentUser?.role === "AUTHOR"
      ? "/author-dashboard"
      : currentUser?.role === "ADMIN"
      ? "/admin-dashboard"
      : "/user-dashboard";

  const dashboardLabel =
    currentUser?.role === "AUTHOR"
      ? "My Articles"
      : currentUser?.role === "ADMIN"
      ? "Dashboard"
      : "Articles";

  const handleLogout = async () => {

    await logout();

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">

        {/* Logo */}
        <NavLink to={userAuthenticate ? dashboardPath : "/home"}>
          <h1 className="text-2xl font-bold tracking-wide text-blue-700">
            My Blog
          </h1>
        </NavLink>

        {/* Nav Links */}
        <ul className="flex flex-wrap items-center gap-2 sm:justify-end">
          {!userAuthenticate && (
          <li>
            <NavLink to="/home" className={navStyles}>
              Home
            </NavLink>
          </li>
          )}

          {userAuthenticate && currentUser ? (
            <>
              <li>
                <NavLink to={dashboardPath} className={navStyles}>
                  {dashboardLabel}
                </NavLink>
              </li>

              {currentUser.role === "AUTHOR" && (
                <li>
                  <NavLink to="/add-article" className={navStyles}>
                    Write
                  </NavLink>
                </li>
              )}

              <li className="hidden text-sm font-medium text-slate-500 sm:block">
                {currentUser.firstName}
              </li>

              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-red-700"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>

      </nav>
    </header>
  );
}

export default Header;
