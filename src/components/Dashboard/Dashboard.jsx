import React from 'react';
import { Card } from 'primereact/card';
import './Dashboard.css';  // Custom CSS for styling

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="grid">
        {/* Row 1 */}
        <div className="card-container">
          <Card className="dashboard-card">
            <div className="card-content">
              <span>New registration today</span>
              <div className="card-count">6</div>
            </div>
          </Card>
          <Card className="dashboard-card">
            <div className="card-content">
              <span>Current month registration</span>
              <div className="card-count">6</div>
            </div>
          </Card>
          <Card className="dashboard-card">
            <div className="card-content">
              <span>Total active members</span>
              <div className="card-count">6</div>
            </div>
          </Card>
          <Card className="dashboard-card">
            <div className="card-content">
              <span>Members packages expired</span>
              <div className="card-count">6</div>
            </div>
          </Card>
          <Card className="dashboard-card">
            <div className="card-content">
              <span>Total Guests</span>
              <div className="card-count">6</div>
            </div>
          </Card>
        </div>
        
        {/* Row 2 */}
        <div className="card-container">
          <Card className="dashboard-card">
            <div className="card-content">
              <span>Payments collected today</span>
              <div className="card-count">6</div>
            </div>
          </Card>
          <Card className="dashboard-card">
            <div className="card-content">
              <span>Current month payments</span>
              <div className="card-count">6</div>
            </div>
          </Card>
          <Card className="dashboard-card">
            <div className="card-content">
              <span>Total payments pending</span>
              <div className="card-count">6</div>
            </div>
          </Card>
          <Card className="dashboard-card">
            <div className="card-content">
              <span>Total payment Received</span>
              <div className="card-count">6</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
