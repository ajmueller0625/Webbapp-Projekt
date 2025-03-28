import { ChevronDown, ChevronUp, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useThemeStore } from "../store/themeStore";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isGameDropdownActive, setGameDropdownState] = useState(false);
  const { isDarkMode, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <header className="w-screen fixed top-0 z-50">
      <nav className="flex items-center justify-between max-w-7xl mx-auto py-4 space-x-15">
        <div className="flex items-center space-x-6 font-semibold">
          <Link to="/">
            <img src={logo} alt="Site Logo" className="h-10" />
          </Link>
          <div className="relative">
            <Search className="absolute text-neutral-600 right-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              className="px-3 py-1 rounded-lg bg-white text-black focus:outline-none"
            />
          </div>
        </div>
        <nav>
          <ul className="font-[Black_Ops_One] flex">
            <Link to="/">
              <li className="py-2 px-6 rounded-lg nav-hover-color">Home</li>
            </Link>
            <Link to="/news">
              <li className="py-2 px-6 rounded-lg nav-hover-color">News</li>
            </Link>
            <li
              className={
                isGameDropdownActive ? "nav-hover-color rounded-t-lg" : ""
              }
              onMouseEnter={() => setGameDropdownState(true)}
              onMouseLeave={() => setGameDropdownState(false)}
            >
              <button className="flex py-2 px-6 items-center hover:cursor-pointer">
                Games
                {isGameDropdownActive ? (
                  <ChevronUp className="ml-1 w-4 h-4" />
                ) : (
                  <ChevronDown className="ml-1 w-4 h-4" />
                )}
              </button>
              {isGameDropdownActive && (
                <ul className="absolute rounded-b-lg rounded-tr-lg nav-ul-background shadow-md shadow-neutral-950/50">
                  <Link to="/topgames">
                    <li className="p-4 nav-li-background rounded-tr-lg">
                      Top Games
                    </li>
                  </Link>
                  <Link to="/latestgames">
                    <li className="p-4 nav-li-background">Latest Games</li>
                  </Link>
                  <Link to="/upcominggames">
                    <li className="p-4 nav-li-background rounded-b-lg">
                      Upcoming Games
                    </li>
                  </Link>
                </ul>
              )}
            </li>
            <Link to="">
              <li className="py-2 px-6 rounded-lg nav-hover-color">Events</li>
            </Link>
            <Link to="">
              <li className="py-2 px-6 rounded-lg nav-hover-color">
                Discussion
              </li>
            </Link>
          </ul>
        </nav>
        <nav className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="relative inline-flex h-6 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none"
            aria-pressed={isDarkMode}
          >
            <span className="sr-only">Toggle dark mode</span>
            <div
              className={`
                  ${isDarkMode ? "bg-neutral-700" : "bg-cyan-400"} 
                  inline-flex h-6 w-10 items-center rounded-full transition-colors duration-300
                `}
            >
              <div
                className={`
                    ${isDarkMode ? "translate-x-5" : "translate-x-0"} 
                    flex items-center justify-center h-5 w-5 transform rounded-full bg-white transition-transform duration-300
                  `}
              >
                {isDarkMode ? (
                  <Moon size={14} className="text-neutral-700" />
                ) : (
                  <Sun size={14} className="text-yellow-700" />
                )}
              </div>
            </div>
          </button>
          <Link to="">
            <button className="font-[Black_Ops_One] text-sm py-2 px-6 rounded-full custom-button hover:cursor-pointer">
              Sign in
            </button>
          </Link>
        </nav>
      </nav>
    </header>
  );
}
