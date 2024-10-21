import React, { useState, useRef } from "react";
import { PanelMenu } from "primereact/panelmenu";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";
import { PrimeIcons } from "primereact/api";
import { OverlayPanel } from "primereact/overlaypanel";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import GuestScreen from "./components/Guest/GuestScreen";
import MemberList from "./components/Members/membersInfo";
import AdminConfigurationForm from "./components/AdminConfiguration/AdminConfigurationForm";
import ReportGenerator from "./components/Reports/ReportGenerator";
import NewMemberRegistration from "./components/Members/NewMemberRegistration";
import PaymentReportGenerator from "./components/Reports/PaymentReportGenerator";
import Package from "./components/Packages/packages";
import UserProfileScreen from "./components/UserProfile/userProfile";
import Scheduler, { SchedulerProvider } from "./components/Schedular/Scheduler"; // Import Scheduler and SchedulerProvider
import UserProfiledashbord from "./components/UserProfile/userProfiledashbord";

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [packages, setPackages] = useState([]);
  const op = useRef(null);

  const handleAddPackage = (newPackage) => {
    setPackages([...packages, newPackage]);
  };

  const handleEditPackage = (index, updatedPackage) => {
    const newPackages = [...packages];
    newPackages[index] = updatedPackage;
    setPackages(newPackages);
  };

  const handleDeletePackage = (index) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  // Menu items for the sidebar
  const items = [
    {
      label: "Dashboard",
      icon: "pi pi-fw pi-home",
      command: () => (window.location.href = "/Dashboard"),
    },
    {
      label: "Reports",
      icon: "pi pi-fw pi-chart-line",
      items: [
        {
          label: "Member & Guests",
          icon: "pi pi-users",
          command: () => (window.location.href = "/ReportGenerator"),
        },
        {
          label: "Payments",
          icon: "pi pi-indian-rupee",
          command: () => (window.location.href = "/PaymentReportGenerator"),
        },
      ],
    },
    {
      label: "Members",
      icon: "pi pi-fw pi-users",
      command: () => (window.location.href = "/MemberList"),
    },
    {
      label: "Schedular",
      icon: "pi pi-fw pi-calendar",
      command: () => (window.location.href = "/Scheduler"),
    },
    {
      label: "Guest",
      icon: "pi pi-users",
      command: () => (window.location.href = "/GuestScreen"),
    },
    {
      label: "Packages",
      icon: "pi pi-tag",
      command: () => (window.location.href = "/packages"),
    },
    {
      label: "Admin Configuration",
      icon: "pi pi-user",
      command: () => (window.location.href = "/AdminConfigurationForm"),
    },
  ];

  return (
    <Router>
      <SchedulerProvider>
        <div className="app-container">
          {/* Header */}
          <div className="header">
            <div className="logo-container">
              <img
                src="img/MARLIN.png"
                alt="Company Logo"
                className="company-logo"
              />
            </div>
            <div className="fonty"> 
              <h2>MARLIN AQUATIC CENTER MANAGEMENT</h2>
            </div>
            <img
              src="img/User.png"
              alt="Profile"
              className="profile-photo"
              onClick={(e) => op.current.toggle(e)}
              style={{ cursor: "pointer" }}
            />
       <OverlayPanel ref={op} dismissable className="profile-overlay">
      <ul className="profile-options">
        <li className="profile-option">
          <Link to="/UserProfileScreen">
            <Button
              icon={PrimeIcons.USER}
              label="Profile"
              className="p-button-text profile-btn"
            />
          </Link>
        </li>
        <li className="profile-option">
          <Link to="/UserProfiledashbord">
            <Button
              icon={PrimeIcons.HOME}
              label="Dashboard"
              className="p-button-text profile-btn"
            />
          </Link>
        </li>
        <li className="profile-option" onClick={() => alert("Logout")}>
          <Button
            icon={PrimeIcons.SIGN_OUT}
            label="Logout"
            className="p-button-text profile-btn"
          />
        </li>
      </ul>
    </OverlayPanel>
          </div>

          {/* Main content with Sidebar */}
          <div className="main-content">
            {/* Sidebar Menu */}
            <div
              className={`sidebar ${sidebarVisible ? "expanded" : "collapsed"}`}
            >
              <Button
                icon="pi pi-bars"
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="toggle-button"
              />
              {sidebarVisible ? (
                <PanelMenu model={items} style={{ width: "100%" }} />
              ) : (
                <div className="collapsed-menu">
                  {items.map((item, index) => (
                    <Button
                      key={index}
                      icon={item.icon}
                      className="collapsed-menu-icon"
                      onClick={item.command}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div
              className={`content-area ${
                sidebarVisible ? "expanded" : "collapsed"
              }`}
            >
              <Routes>
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route
                  path="/AdminConfigurationForm"
                  element={<AdminConfigurationForm />}
                />
                <Route path="/MemberList" element={<MemberList />} />
                <Route path="/GuestScreen" element={<GuestScreen />} />
                <Route path="/ReportGenerator" element={<ReportGenerator />} />
                <Route
                  path="/PaymentReportGenerator"
                  element={<PaymentReportGenerator />}
                />
                <Route
                  path="/NewMemberRegistration"
                  element={<NewMemberRegistration />}
                />
                <Route
                  path="/packages"
                  element={
                    <Package
                      packages={packages}
                      addPackage={handleAddPackage}
                      editPackage={handleEditPackage}
                      deletePackage={handleDeletePackage}
                    />
                  }
                />
                <Route path="/Scheduler" element={<Scheduler />} />
                <Route path="/UserProfileScreen" element={<UserProfileScreen />} />
                <Route
                  path="/UserProfiledashbord"
                  element={<UserProfiledashbord />}
                />
              </Routes>
            </div>
          </div>

          {/* Footer */}
          <div
            className="footer"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30px",
            }}
          >
            © 2024 Marlin Aquatic Center Viewer Edition. All Rights Reserved.
          </div>
        </div>
      </SchedulerProvider>
    </Router>
  );
};

export default App;
