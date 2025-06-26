import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart2,
  BookOpen,
  Home,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  TrendingUp,
  User as UserIcon,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/react.svg";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
// Define navigation links for both top and bottom nav
const mainNavLinks = [
  { name: "Từ Vựng", path: "/vocabulary", icon: BookOpen },
  { name: "Luyện Tập", path: "/practice", icon: Home },
  { name: "Trợ Lý AI", path: "/ai-chat", icon: MessageSquare },
  { name: "Bảng Điều Khiển", path: "/dashboard", icon: BarChart2 },
];

const avatarDropdownLinks = [
  { name: "Hồ Sơ", path: "/profile", icon: Settings },
  { name: "Thành Tựu", path: "/achievements", icon: Award },
  { name: "Bảng Xếp Hạng", path: "/leaderboard", icon: TrendingUp },
];

const getFirstLetter = (username) => {
  return username ? username.charAt(0).toUpperCase() : "";
};

// Desktop Header Component
const DesktopHeader = ({
  isAuthenticated,
  user,
  logout,
  location,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  mobileMenuButtonRef,
}) => {
  // mobileMenuButtonRef added here
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const avatarRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsAvatarDropdownOpen(false);
  };

  const renderMainNavLinksDesktop = () => (
    // Extracted for reusability and clarity
    <ul className="flex space-x-1 md:space-x-2 lg:space-x-3 items-center">
      {mainNavLinks.map((link) => {
        const isActive = location.pathname === link.path;
        return (
          isAuthenticated && (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`relative px-4 py-2 rounded-full font-medium transition-all duration-300 ease-in-out flex items-center justify-center
                            text-base ${
                              isActive
                                ? "bg-lexi-button text-white shadow-md"
                                : "text-gray-800 hover:bg-gray-100/30"
                            }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-lexi-button -z-10"
                    transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            </li>
          )
        );
      })}
    </ul>
  );

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
      className="relative max-w-6xl w-full bg-white/10 backdrop-blur-xl rounded-full px-6 py-3 shadow-custom-light-lg flex justify-between items-center h-auto border border-white/20"
    >
      <Link
        to="/"
        className="text-3xl font-extrabold tracking-wide text-gray-800 hover:text-lexi-button transition-colors duration-200"
      >
        LEXIAI
      </Link>

      <nav className="hidden md:flex flex-grow justify-center items-center px-4">
        {renderMainNavLinksDesktop()}
      </nav>

      <div className="hidden md:flex items-center ml-auto">
        {isAuthenticated ? (
          <div
            className="relative"
            onMouseEnter={() => setIsAvatarDropdownOpen(true)}
            onMouseLeave={() => setIsAvatarDropdownOpen(false)}
            ref={avatarRef}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-lexi-button flex items-center justify-center text-white font-bold text-lg cursor-pointer shadow-md border-2 border-white/50 overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
              }}
              transition={{ duration: 0.2 }}
              aria-label={`User avatar for ${user?.username}`}
            >
              {getFirstLetter(user?.username)}
            </motion.div>
            <AnimatePresence>
              {isAvatarDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="avatar-dropdown-content absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-lg rounded-lg shadow-xl py-2 z-50 border border-gray-200/50 origin-top-right overflow-hidden"
                >
                  <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200/50 flex items-center">
                    <UserIcon
                      size={16}
                      className="mr-2 text-lexi-illustration-secondary"
                    />
                    <span className="font-semibold">
                      {user?.username || "Bạn"}
                    </span>
                  </div>
                  {avatarDropdownLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100/50 transition-colors duration-150"
                      onClick={() => setIsAvatarDropdownOpen(false)}
                    >
                      {link.icon && (
                        <link.icon
                          size={18}
                          className="mr-2 text-lexi-illustration-secondary"
                        />
                      )}
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200/50 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50/50 transition-colors duration-150"
                    >
                      <LogOut size={18} className="mr-2" /> Đăng xuất
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex space-x-4 items-center">
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="!border-gray-800 !text-gray-800 hover:!bg-gray-100/30"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Đăng ký
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Button - right aligned (hidden on desktop) */}
      <div
        className="md:hidden flex items-center mobile-menu-button ml-auto"
        ref={mobileMenuButtonRef}
      >
        <Button
          variant="ghost"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-800 hover:bg-gray-100/30 p-2 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </Button>
      </div>
    </motion.div>
  );
};

const MobileBottomNav = ({
  isAuthenticated,
  user,
  logout,
  location,
  setIsMobileMenuOpen,
  mobileMenuButtonRef,
}) => {
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-4 px-2 sm:px-4 md:hidden">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="relative max-w-sm w-full bg-white/30 backdrop-blur-xl rounded-full px-4 py-2 shadow-xl flex justify-between items-center h-auto border border-white/40"
        >
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wide text-gray-800 hover:text-lexi-button transition-colors duration-200"
          >
            LEXIAI
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="text-gray-800 text-sm font-semibold hidden sm:inline">
                Chào, {user?.username || "Bạn"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-800 hover:bg-gray-100/30 p-2 rounded-lg"
              >
                <UserIcon size={20} />
              </Button>
            </div>
          ) : (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-800 hover:bg-gray-100/30 p-2 rounded-lg"
              >
                <Menu size={20} />
              </Button>
            </div>
          )}
        </motion.div>
      </header>

      {/* Bottom Nav */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-2 py-3 md:hidden">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="relative w-full max-w-xl bg-white/30 backdrop-blur-xl rounded-full px-4 py-2 shadow-custom-light-lg flex justify-around items-center border border-white/40"
        >
          {isAuthenticated ? (
            mainNavLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 ease-in-out
                  ${
                    active
                      ? "bg-lexi-button text-white"
                      : "text-gray-800 hover:bg-gray-200/50"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="bottomNavLink"
                      className="absolute inset-0 rounded-full bg-lexi-button -z-10"
                      transition={{
                        type: "spring",
                        duration: 0.4,
                        bounce: 0.2,
                      }}
                    />
                  )}
                  {link.icon && (
                    <link.icon
                      size={24}
                      className={active ? "text-white" : "text-gray-800"}
                    />
                  )}
                  <span
                    className={`text-xs font-medium mt-1 ${
                      active ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {link.name}
                  </span>
                </Link>
              );
            })
          ) : (
            <>
              {[
                {
                  name: "Đăng nhập",
                  path: "/login",
                  icon: LogIn,
                },
                {
                  name: "Đăng ký",
                  path: "/register",
                  icon: UserPlus,
                },
              ].map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 ease-in-out
                    ${
                      active
                        ? "bg-lexi-button text-white"
                        : "text-gray-800 hover:bg-gray-200/50"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="bottomNavLink"
                        className="absolute inset-0 rounded-full bg-lexi-button -z-10"
                        transition={{
                          type: "spring",
                          duration: 0.4,
                          bounce: 0.2,
                        }}
                      />
                    )}
                    <link.icon
                      size={24}
                      className={active ? "text-white" : "text-gray-800"}
                    />
                    <span
                      className={`text-xs font-medium mt-1 ${
                        active ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </>
          )}
        </motion.div>
      </footer>
    </>
  );
};

// Main Header Component - Renders different headers based on screen size
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null); // Declare mobileMenuButtonRef here

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Logic for closing MobileMenuOverlay when clicking outside of it,
      // ensuring clicks on the open button or inside the menu don't close it.
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  // Mobile Full-Screen Overlay Menu (for profile, achievements, logout, etc.)
  // Mobile Full-Screen Overlay Menu (for profile, achievements, logout, etc.)
  const MobileMenuOverlay = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mobile-menu-container md:hidden fixed inset-0 bg-white/90 backdrop-blur-xl p-6 shadow-lg z-[100] overflow-y-auto border-t border-gray-200/50"
          ref={mobileMenuRef}
        >
          {/* Close button at top right of the overlay */}
          <div className="absolute top-4 right-4 z-[110]">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-800 hover:bg-gray-100/30 p-2 rounded-full"
            >
              <X size={28} />
            </Button>
          </div>

          <div className="w-full flex flex-col items-start px-4 mt-16">
            {isAuthenticated ? (
              <>
                <div className="flex items-center py-6 mb-6 border-b border-gray-200/50 w-full">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-lexi-button flex items-center justify-center text-white font-bold text-3xl shadow-lg mr-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                  >
                    {getFirstLetter(user?.username)}
                  </motion.div>
                  <span className="text-gray-800 text-xl font-semibold">
                    Chào, {user?.username || "Bạn"}
                  </span>
                </div>

                <ul className="flex flex-col space-y-4 w-full">
                  {mainNavLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="flex items-center px-4 py-3 text-2xl font-medium text-gray-800 hover:bg-gray-100/30 transition-colors duration-200 rounded-lg w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.icon && (
                          <link.icon
                            size={28}
                            className="mr-3 text-lexi-illustration-secondary"
                          />
                        )}
                        {link.name}
                      </Link>
                    </li>
                  ))}

                  {avatarDropdownLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="flex items-center px-4 py-3 text-2xl font-medium text-gray-800 hover:bg-gray-100/30 transition-colors duration-200 rounded-lg w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.icon && (
                          <link.icon
                            size={28}
                            className="mr-3 text-lexi-illustration-secondary"
                          />
                        )}
                        {link.name}
                      </Link>
                    </li>
                  ))}

                  <li className="pt-6 border-t border-gray-200/50 mt-6 w-full">
                    <Button
                      onClick={handleLogout}
                      variant="danger"
                      size="lg"
                      className="w-full max-w-xs"
                    >
                      <LogOut size={24} className="mr-2" /> Đăng xuất
                    </Button>
                  </li>
                </ul>
              </>
            ) : (
              <div className="flex flex-col space-y-4 pt-6 border-t border-gray-200/50 mt-6 w-full px-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full !border-gray-800 !text-gray-800 hover:!bg-gray-100/30"
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Render Desktop Header for md and larger screens */}
      <div className="hidden md:flex justify-center fixed top-0 left-0 right-0 z-50 py-4 px-2 sm:px-4">
        {/* Pass mobileMenuButtonRef and isMobileMenuOpen to DesktopHeader */}
        <DesktopHeader
          isAuthenticated={isAuthenticated}
          user={user}
          logout={logout}
          location={location}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          mobileMenuButtonRef={mobileMenuButtonRef}
        />
      </div>

      {/* Render Mobile Headers/Bottom Nav for screens smaller than md */}
      <div className="md:hidden">
        {/* Pass mobileMenuButtonRef and isMobileMenuOpen to MobileBottomNav */}
        <MobileBottomNav
          isAuthenticated={isAuthenticated}
          user={user}
          logout={logout}
          location={location}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          mobileMenuButtonRef={mobileMenuButtonRef}
        />
        <MobileMenuOverlay />
      </div>
    </>
  );
};

export default Header;
