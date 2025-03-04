"use client";

import Link from "next/link";
import { useState } from "react";
import { About, Blog, Contact, Home, Listing, Pages } from "./Menu";

const MobileMenu = () => {
  const [toggle, setToggle] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const activeMenuSet = (value) =>
      setActiveMenu(activeMenu === value ? "" : value),
    activeLi = (value) =>
      value === activeMenu ? { display: "block" } : { display: "none" };
  return (
    <header className="header-area header-area-one d-xl-none">
      <div className="header-top">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <div className="top-social">
                <ul className="social-link">
                  <li>
                    <span>Follow us:</span>
                  </li>
                  <li>
                    <a href="#">
                      <i className="ti-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="ti-twitter-alt"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="ti-pinterest"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="ti-dribbble"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="ti-instagram"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-5">
              <div className="top-content text-center">
                <p>
                  We Have Special Offers Every{" "}
                  <Link href="/">Find your offer</Link>
                </p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="top-right">
                <ul className="d-flex">
                  <li>
                    <Link href="/">
                      <i className="ti-search"></i>
                      <span>Search here</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/">
                      <i className="ti-heart"></i>
                      <span>Wishlist</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/">
                      <i className="ti-shopping-cart"></i>
                      <span>Cart</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="header-navigation sticky breakpoint-on">
        <div className="container-fluid">
          <div className="primary-menu">
            <div className="row">
              <div className="col-lg-2 col-5">
                <div className="site-branding">
                  <Link className="brand-logo" href="/">
                    <img src="assets/images/logo/logo-1.png" alt="Brand Logo" />
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 col-2">
                <div className={`nav-menu ${toggle ? "menu-on" : ""}`}>
                  <div
                    className="navbar-close"
                    onClick={() => setToggle(false)}
                  >
                    <i className="ti-close"></i>
                  </div>
                  <nav className="main-menu">
                    <ul>
                      <li className="menu-item has-children">
                        <Link href="/">Home</Link>
                        <ul className="sub-menu" style={activeLi("Home")}>
                          <Home />
                        </ul>
                        <span
                          className="dd-trigger"
                          onClick={() => activeMenuSet("Home")}
                        >
                          <i className="ti-arrow-down"></i>
                        </span>
                      </li>
                      <About />
                      <li className="menu-item has-children">
                        <a href="#">Listings</a>
                        <ul className="sub-menu" style={activeLi("Listings")}>
                          <Listing />
                        </ul>
                        <span
                          className="dd-trigger"
                          onClick={() => activeMenuSet("Listings")}
                        >
                          <i className="ti-arrow-down"></i>
                        </span>
                      </li>
                      <li className="menu-item has-children">
                        <a href="#">Pages</a>
                        <ul className="sub-menu" style={activeLi("Pages")}>
                          <Pages />
                        </ul>
                        <span
                          className="dd-trigger"
                          onClick={() => activeMenuSet("Pages")}
                        >
                          <i className="ti-arrow-down"></i>
                        </span>
                      </li>
                      <li className="menu-item has-children">
                        <a href="#">Article</a>
                        <ul className="sub-menu" style={activeLi("Article")}>
                          <Blog />
                        </ul>
                        <span
                          className="dd-trigger"
                          onClick={() => activeMenuSet("Article")}
                        >
                          <i className="ti-arrow-down"></i>
                        </span>
                      </li>
                      <Contact />
                      <li className="nav-btn">
                        <Link className="main-btn icon-btn" href="/add-listing">
                          Add Listing
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-lg-4 col-5">
                <div className="header-right-nav">
                  <ul className="d-flex align-items-center">
                    <li className="user-btn">
                      <Link className="icon" href="/">
                        <i className="flaticon-avatar"></i>
                      </Link>
                    </li>
                    <li className="hero-nav-btn">
                      <Link className="main-btn icon-btn" href="/add-listing">
                        Add Listing
                      </Link>
                    </li>
                    <li className="nav-toggle-btn">
                      <div
                        className={`navbar-toggler ${toggle ? "active" : ""}`}
                        onClick={() => setToggle(!toggle)}
                      >
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default MobileMenu;
