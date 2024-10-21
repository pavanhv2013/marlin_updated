import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import "./membersinfo.css";

const MemberList = () => {
  const navigate = useNavigate();

  const goToAboutPage = () => {
    navigate("/NewMemberRegistration");
  };

  const [membersExpiringToday] = useState([
    {
      name: "Srinidhi ",
      contact: "1234567890",
      paymentstatus: "Paid",
      payment: "5000",
      package: "Basic",
    },
    {
      name: "Vijay",
      contact: "0987654321",
      paymentstatus: "Pending",
      payment: "2000",
      package: "Premium",
    },
    {
      name: "Pavan",
      contact: "1112223334",
      paymentstatus: "Partial",
      payment: "1200",
      package: "Standard",
    },
  ]);

  const [membersExpiringIn5Days] = useState([
    {
      name: "Pavan",
      contact: "1112223334",
      paymentstatus: "Partial",
      payment: "1400",
      package: "Standard",
    },
    {
      name: "Srinidhi ",
      contact: "1234567890",
      paymentstatus: "Paid",
      payment: "5000",
      package: "Basic",
    },
    {
      name: "Vijay",
      contact: "0987654321",
      paymentstatus: "Paid",
      payment: "10000",
      package: "Premium",
    },
  ]);

  const [allMembers] = useState([
    {
      name: "Bhuvan",
      contact: "2223334445",
      paymentstatus: "Pending",
      payment: "5000",
      daysLeft: "10",
      package: "Basic",
    },
    {
      name: "Srinidhi ",
      contact: "1234567890",
      paymentstatus: "Paid",
      payment: "15000",
      package: "Basic",
    },
    {
      name: "Vijay",
      contact: "0987654321",
      paymentstatus: "Partial",
      payment: "2000",
      package: "Premium",
    },
  ]);

  const actionTemplate = () => (
    <div>
      <Button icon="pi pi-pencil" className="p-button-rounded  mr-2" />
      <Button icon="pi pi-trash" className="p-button-rounded  mr-2" />
      <Button icon="pi pi-refresh" className="p-button-rounded p-button-info" />
    </div>
  );

  return (
    <div>
      {/* Search Box */}
      <Button
        label="Add Member"
        icon="pi pi-plus"
        className="mb-3"
        onClick={goToAboutPage}
      />

      {/* Members List - Expiring Today */}
      <h3>Members List - Expiring Today</h3>

      <div className="members-container">
        <DataTable value={membersExpiringToday} className="custom-table">
          <Column field="name" header="Name" />
          <Column field="contact" header="Contact" />
          <Column field="paymentstatus" header="Payment Status" />
          <Column field="payment" header="Payment" />
          <Column field="package" header="Package" />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>

      {/* Members List - Expiring in 5 Days */}
      <h3 className="mt-5">Members List - Expiring in 5 Days</h3>
      <div className="members-container">
        <DataTable value={membersExpiringIn5Days} className="custom-table">
          <Column field="name" header="Name" />
          <Column field="contact" header="Contact" />
          <Column field="paymentstatus" header="Payment Status" />
          <Column field="payment" header="Payment" />
          <Column field="package" header="Package" />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>

      {/* Full Members List */}
      <h3 className="mt-5">Full Members List</h3>
      <div className="p-inputgroup mb-3">
        <span className="p-inputgroup-addon">
          <i className="pi pi-search"></i>
        </span>
        <InputText
          placeholder="Search Members ( Enter Name or Contact Number )"
     
        />
      </div>
      <div className="members-container">
        <DataTable value={allMembers} className="custom-table">
          <Column field="name" header="Name" />
          <Column field="contact" header="Contact" />
          <Column field="paymentstatus" header="Payment Status" />
          <Column field="payment" header="Payment" />
          <Column field="daysLeft" header="No of Days" />
          <Column field="package" header="Package" />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
};

export default MemberList;
