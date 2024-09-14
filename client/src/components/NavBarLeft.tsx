import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { FaBars } from "react-icons/fa";
import styles from "../css/profile_nav.module.css";

interface NavBarTopProps {
  menuItems: Array<{name: string, path: string}>;
  activeLink: string;
  setActiveLink: any;
  onLogout: (e: Event) => void;
  toggleTopNav: any;
}

const NavBarTop = ({
  menuItems,
  activeLink,
  setActiveLink,
  onLogout,
  toggleTopNav,
}: NavBarTopProps) => {
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
          onClick={(e) => {
            menu.name === "LOGOUT" ? onLogout(e as any) : toggleTopNav();
            setActiveLink(menu.path);
          }}
        >
          {menu.name}
        </Link>
      ))}
    </div>
  );
};

function NavBarLeft() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);

  const [activeLink, setActiveLink] = useState("PROFILE");

  const [showTopNav, setTopNav] = useState(false);

  const toggleTopNav = () => {
    setTopNav(!showTopNav);
  };

  const onLogout = (e: Event) => {
    e.preventDefault();
    dispatch(logout())
      .unwrap()
      .then(() => navigate("/home"));
  };

  const menuItems = [
    { name: "PROFILE", path: "/profile", position: "top" },
    {
      name: "NEW RELEASE",
      path:
        user.trackAllowance >= 1
          ? "/profile/newrelease"
          : "/profile/checkoutpage",
      position: "top",
    },
    // { name: 'CHECKOUT', path: "/profile/checkoutpage", position: 'top' },
    { name: "SINGLES", path: "/profile/singles", position: "top" },
    // { name: 'EMAIL', path: "/email", position: 'top' },
    // { name: 'ADMIN', path: "/admin", position: 'bot' },
    // { name: 'SETTINGS', path: "/", position: 'bot' },
    { name: "LOGOUT", path: "/", position: "bot" },
  ];
  useEffect(() => {
    setActiveLink(location.pathname);

    if (location.pathname.includes("/editprofile")) {
      setActiveLink("/profile");
    } else if (location.pathname.includes("/singleedit") || location.pathname.includes("/singleview")) {
      setActiveLink("/profile/singles");
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
          onLogout={onLogout as any}
          toggleTopNav={toggleTopNav}
        />
      ) : null}
      <section id={styles.navbar_container}>
        <div id={styles.navbar_header}>
          <h1>{"Welcome, " + user.username}</h1>
        </div>
        <div className={styles.navbar_left}>
          <div className={styles.navbar_left_links}>
            {menuItems
              .filter((menu) => menu.position === "top")
              .map((menu) => (
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
        </div>
        <div id={styles.navbar_footer}>
          <div className={styles.navbar_left_links}>
            {menuItems
              .filter((menu) => menu.position === "bot")
              .map((menu) => (
                <Link
                  key={menu.name}
                  to={menu.path}
                  className={
                    activeLink === menu.path ? styles.active : styles.inactive
                  }
                  onClick={(e) =>
                    menu.name === "LOGOUT"
                      ? onLogout(e as any)
                      : setActiveLink(menu.path)
                  }
                >
                  {menu.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default NavBarLeft;
