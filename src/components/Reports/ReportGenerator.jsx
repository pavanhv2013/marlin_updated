import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'; // Import the XLSX library for Excel export
import './ReportGenerator.css';

const ReportGenerator = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);

  // Sample data for active members, expired members, and guests
  const [activeMembers] = useState([
    { name: 'John Doe', contact: '123-456-7890', package: 'Standard', amountPaid: '$100', amountRemaining: '$50', duration: '6 months', registrationDate: '2024-09-15' },
    { name: 'Jane Smith', contact: '987-654-3210', package: 'Premium', amountPaid: '$200', amountRemaining: '$0', duration: '1 year', registrationDate: '2024-09-20' },
  ]);

  const [expiredMembers] = useState([
    { name: 'Alice Johnson', contact: '555-555-5555', package: 'Standard', amountPaid: '$100', amountRemaining: '$0', duration: 'Expired 2 months ago', registrationDate: '2024-07-15' },
    { name: 'Bob Brown', contact: '444-444-4444', package: 'Basic', amountPaid: '$50', amountRemaining: '$20', duration: 'Expired 1 month ago', registrationDate: '2024-08-20' },
  ]);

  const [guestDetails] = useState([
    { name: 'Tom Hanks', contact: '111-222-3333', package: 'Guest', amountPaid: '$0', amountRemaining: '$0', duration: 'N/A', registrationDate: '2024-09-10' },
    { name: 'Emma Watson', contact: '222-333-4444', package: 'Guest', amountPaid: '$0', amountRemaining: '$0', duration: 'N/A', registrationDate: '2024-09-11' },
  ]);

  const timePeriodOptions = [
    { label: 'All', value: 'all' },
    { label: 'Month', value: 'monthly' },
    { label: 'Last 3 Months', value: 'current_quarter_month' },
    { label: 'Last 6 Months', value: 'last_half_year' },
    { label: 'Last 1 Year', value: 'last_1_year' },
  ];

  const orderOptions = [
    { label: 'Amount High to Low', value: 'amount_high_to_low' },
    { label: 'Amount Low to High', value: 'amount_low_to_high' },
    { label: 'Registration Date Low to High', value: 'reg_date_low_to_high' },
  ];

  const generateReport = () => {
    setDisplayDialog(true); // Open the dialog when generating the report
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.text('Report', 14, 16);

    // Export Active Members
    autoTable(doc, {
      head: [['Name', 'Contact', 'Package', 'Amount Paid', 'Amount Remaining', 'Duration']],
      body: activeMembers.map(member => [member.name, member.contact, member.package, member.amountPaid, member.amountRemaining, member.duration]),
      startY: 30,
    });

    // Export Expired Members
    autoTable(doc, {
      head: [['Name', 'Contact', 'Package', 'Amount Paid', 'Amount Remaining', 'Duration']],
      body: expiredMembers.map(member => [member.name, member.contact, member.package, member.amountPaid, member.amountRemaining, member.duration]),
      startY: doc.autoTable.previous.finalY + 10,
    });

    // Export Guest Details
    autoTable(doc, {
      head: [['Name', 'Contact', 'Package', 'Amount Paid', 'Amount Remaining', 'Duration']],
      body: guestDetails.map(guest => [guest.name, guest.contact, guest.package, guest.amountPaid, guest.amountRemaining, guest.duration]),
      startY: doc.autoTable.previous.finalY + 10,
    });

    doc.save('report.pdf');
  };

  const exportExcel = () => {
    // Prepare data for export
    const membersData = [
      ...activeMembers.map(member => ({
        Name: member.name,
        Contact: member.contact,
        Package: member.package,
        AmountPaid: member.amountPaid,
        AmountRemaining: member.amountRemaining,
        Duration: member.duration,
      })),
      ...expiredMembers.map(member => ({
        Name: member.name,
        Contact: member.contact,
        Package: member.package,
        AmountPaid: member.amountPaid,
        AmountRemaining: member.amountRemaining,
        Duration: member.duration,
      })),
      ...guestDetails.map(guest => ({
        Name: guest.name,
        Contact: guest.contact,
        Package: guest.package,
        AmountPaid: guest.amountPaid,
        AmountRemaining: guest.amountRemaining,
        Duration: guest.duration,
      })),
    ];

    const worksheet = XLSX.utils.json_to_sheet(membersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Members and Guests');

    // Export to Excel
    XLSX.writeFile(workbook, 'report.xlsx');
  };

  return (
    <div className="report-generator-unique">
      <h2 className="report-header-unique">Reports - Members & Guests</h2>

      {/* Top Section */}
      <div className="p-panel p-my-2">
        <div className="p-grid p-align-center p-justify-between">
          <div className="p-col-3">
            <label htmlFor="fromDate">From Date:</label>
            <Calendar id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.value)} showIcon />
          </div>
          <div className="p-col-3">
            <label htmlFor="toDate">To Date:</label>
            <Calendar id="toDate" value={toDate} onChange={(e) => setToDate(e.value)} showIcon />
          </div>
          <div className="p-col-2">
            <Dropdown value={selectedTimePeriod} options={timePeriodOptions} onChange={(e) => setSelectedTimePeriod(e.value)} placeholder="Select Time Period" />
          </div>
          <div className="p-col-2">
            <Dropdown value={selectedOrder} options={orderOptions} onChange={(e) => setSelectedOrder(e.value)} placeholder="Order By" />
          </div>
        </div>
        {/* Move the Generate Report button below the Order By dropdown */}
        <div className="p-my-2">
          <Button label="Generate Report" icon="pi pi-file" onClick={generateReport} />
        </div>
      </div>

      {/* Dialog for Report */}
      <Dialog header="Generated Report" visible={displayDialog} onHide={() => setDisplayDialog(false)} style={{ width: '70vw' }}>
        {/* Active Members Table */}
        <div className="p-panel p-my-2">
          <h4>Active Members</h4>
          <table className="p-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Package</th>
                <th>Amount Paid</th>
                <th>Amount Remaining</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {activeMembers.map((member, index) => (
                <tr key={index}>
                  <td>{member.name}</td>
                  <td>{member.contact}</td>
                  <td>{member.package}</td>
                  <td>{member.amountPaid}</td>
                  <td>{member.amountRemaining}</td>
                  <td>{member.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expired Members Table */}
        <div className="p-panel p-my-2">
          <h4>Expired Members</h4>
          <table className="p-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Package</th>
                <th>Amount Paid</th>
                <th>Amount Remaining</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {expiredMembers.map((member, index) => (
                <tr key={index}>
                  <td>{member.name}</td>
                  <td>{member.contact}</td>
                  <td>{member.package}</td>
                  <td>{member.amountPaid}</td>
                  <td>{member.amountRemaining}</td>
                  <td>{member.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Guests Table */}
        <div className="p-panel p-my-2">
          <h4>Guests</h4>
          <table className="p-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Package</th>
                <th>Amount Paid</th>
                <th>Amount Remaining</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {guestDetails.map((guest, index) => (
                <tr key={index}>
                  <td>{guest.name}</td>
                  <td>{guest.contact}</td>
                  <td>{guest.package}</td>
                  <td>{guest.amountPaid}</td>
                  <td>{guest.amountRemaining}</td>
                  <td>{guest.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-dialog-footer">
          <Button label="Export to PDF" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-secondary" />
          <Button label="Export to Excel" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-secondary" />
          <Button label="Close" icon="pi pi-times" onClick={() => setDisplayDialog(false)} />
        </div>
      </Dialog>
    </div>
  );
};

export default ReportGenerator;
