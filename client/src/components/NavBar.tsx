import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import SMLogo from "../images/smLogo.png";
import styles from "../css/navbar.module.css";

// TODO: Change to popup bar
const NavBarTop = ({ menuItems, activeLink, setActiveLink, toggleTopNav }) => {
  return (
    <div
      className={styles.navbar_left_links}
      id={styles.navbar_top_links}
    >
      {menuItems.map((menu) => (
        <Link
          key={menu.name}
          to={menu.path}
          className={activeLink === menu.path ? styles.active : styles.inactive}
          onClick={() => {
            toggleTopNav();
            setActiveLink(menu.path);
          }}
        >
          {menu.name}
        </Link>
      ))}
    </div>
  );
};

function NavBar() {
  const location = useLocation();

  const [activeLink, setActiveLink] = useState("HOME");
  const [showTopNav, setTopNav] = useState(false);

  const toggleTopNav = (e) => {
    window.scrollTo(0, 0)
    showTopNav === false ? setTopNav(true) : setTopNav(false);
  };

  const menuItems = [
    { name: "HOME", path: "/home" },
    { name: "WHO WE ARE", path: "/home/aboutus" },
    // { name: 'FAQ', path: "/home/faq" },
    // { name: 'PRICING', path: "/home" },
    { name: "SIGN IN", path: "/home/signin" },
    { name: "SIGN UP", path: "/home/emailsignup" },
  ];

  useEffect(() => {
    setActiveLink(location.pathname);

    if (location.pathname === "/") {
      setActiveLink("/home");
    } else if (location.pathname.includes("/signup")) {
      setActiveLink("/home/emailsignup");
    } else if (
      location.pathname.includes("/forgotpass") ||
      location.pathname.includes("/resetpass")
    ) {
      setActiveLink("/home/signin");
    }
  }, [location]);

  return (
    <>
      <div
        id={styles.top_nav_container}
        onClick={toggleTopNav}
      >
        <FaBars id={styles.fabars} />
        <h1>Single Maximizer</h1>
      </div>
      {showTopNav ? (
        <NavBarTop
          menuItems={menuItems}
          activeLink={activeLink}
          setActiveLink={setActiveLink}
          toggleTopNav={toggleTopNav}
        />
      ) : null}
      <nav id={styles.navbar}>
        <Link
          to={"/home"}
          onClick={() => {
            setActiveLink("/home")
            window.scrollTo(0, 0)
          }}
        >
          <img
            src={SMLogo}
            alt="Home"
            id={styles.logo}
          />
        </Link>
        <div id={styles.nav_links}>
          {menuItems.map((menu) => (
            <Link
              key={menu.name}
              to={menu.path}
              className={
                activeLink === menu.path ? styles.active : styles.inactive
              }
              onClick={() => setActiveLink(menu.path)}
            >
              {menu.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
