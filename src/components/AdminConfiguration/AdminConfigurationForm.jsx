import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './AdminConfigurationForm.css';

const AdminConfigurationForm = () => {
  const [activeTab, setActiveTab] = useState('settings'); // Default active tab
  const [roles, setRoles] = useState([{ name: 'SuperAdmin', features: '' }]); // Roles state
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog visibility
  const [newRole, setNewRole] = useState({ name: '', features: '' }); // New role state
  const [editingRole, setEditingRole] = useState(null); // Role being edited

  // Yup validation schema
  const roleValidationSchema = Yup.object().shape({
    name: Yup.string().required('Role name is required'),
    features: Yup.string().required('Role features are required'),
  });

  // Add or edit role
  const handleSaveRole = (values) => {
    if (editingRole !== null) {
      const updatedRoles = roles.map((role, index) =>
        index === editingRole ? values : role
      );
      setRoles(updatedRoles);
    } else {
      setRoles([...roles, values]);
    }
    setNewRole({ name: '', features: '' });
    setIsDialogOpen(false);
    setEditingRole(null);
  };

  // Open dialog for editing role
  const handleEditRole = (index) => {
    setEditingRole(index);
    setNewRole(roles[index]);
    setIsDialogOpen(true);
  };

  // Delete role
  const handleDeleteRole = (index) => {
    setRoles(roles.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Form Container */}
      <div className="admin-config-form-container">
        {/* Navigation Tabs */}
        <nav className="admin-config-tabs">
          <button
            className={`admin-config-tab ${activeTab === 'sms' ? 'active' : ''}`}
            onClick={() => setActiveTab('sms')}
          >
            SMS
          </button>
          <button
            className={`admin-config-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button
            className={`admin-config-tab ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
        </nav>

        {activeTab === 'sms' && (
          <Formik
            initialValues={{
              fiveDaysEarlier: '',
              oneDayBefore: '',
              expiryDay: '',
              oneMonthExpired: '',
              registrationMessage: '',
              registrationSuccessMessage: '',
            }}
            validationSchema={Yup.object({
              fiveDaysEarlier: Yup.string().required('Required'),
              oneDayBefore: Yup.string().required('Required'),
              expiryDay: Yup.string().required('Required'),
              oneMonthExpired: Yup.string().required('Required'),
              registrationMessage: Yup.string().required('Required'),
              registrationSuccessMessage: Yup.string().required('Required'),
            })}
            onSubmit={(values) => {
              console.log('SMS Settings Submitted: ', values);
            }}
          >
            {() => (
              <Form>
                <div className="admin-config-form-column">
                  {/* SMS Settings */}
                  <div className="admin-config-form-group">
                    <label htmlFor="fiveDaysEarlier">5 Days Earlier:</label>
                    <Field type="text" id="fiveDaysEarlier" name="fiveDaysEarlier" />
                    <ErrorMessage name="fiveDaysEarlier" component="div" className="error" />

                    <label htmlFor="oneDayBefore">1 Day Before:</label>
                    <Field type="text" id="oneDayBefore" name="oneDayBefore" />
                    <ErrorMessage name="oneDayBefore" component="div" className="error" />

                    <label htmlFor="expiryDay">Expiry Day:</label>
                    <Field type="text" id="expiryDay" name="expiryDay" />
                    <ErrorMessage name="expiryDay" component="div" className="error" />

                    <label htmlFor="oneMonthExpired">One Month Expired:</label>
                    <Field type="text" id="oneMonthExpired" name="oneMonthExpired" />
                    <ErrorMessage name="oneMonthExpired" component="div" className="error" />

                    <label htmlFor="registrationMessage">Registration Message:</label>
                    <Field type="text" id="registrationMessage" name="registrationMessage" />
                    <ErrorMessage name="registrationMessage" component="div" className="error" />

                    <label htmlFor="registrationSuccessMessage">Registration Success Message:</label>
                    <Field type="text" id="registrationSuccessMessage" name="registrationSuccessMessage" />
                    <ErrorMessage name="registrationSuccessMessage" component="div" className="error" />
                  </div>
                </div>
                <button type="submit" className="admin-config-save-btn">Save</button>

              </Form>
            )}
          </Formik>
        )}

        {activeTab === 'settings' && (
          <Formik
            initialValues={{
              otpTimeout: '',
              homeScreenImage1: null,
              homeScreenImage2: null,
              homeScreenImage3: null,
              contactNumber: '',
              contactAddress: '',
              emailId: '',
              noOfSlots: '',
            }}
            validationSchema={Yup.object({
              otpTimeout: Yup.string().required('Required'),
              contactNumber: Yup.string().required('Required'),
              contactAddress: Yup.string().required('Required'),
              emailId: Yup.string().email('Invalid email address').required('Required'),
              noOfSlots: Yup.string().required('Required'),
            })}
            onSubmit={(values) => {
              console.log('Settings Submitted: ', values);
            }}
          >
            {() => (
              <Form>
                <div className="admin-config-form-column">
                  {/* Settings Form */}
                  <div className="admin-config-form-group">
                    <label htmlFor="otpTimeout">OTP Timeout:</label>
                    <Field type="text" id="otpTimeout" name="otpTimeout" />
                    <ErrorMessage name="otpTimeout" component="div" className="error" />

                    <label htmlFor="homeScreenImage1">Home Screen Image 1:</label>
                    <input type="file" id="homeScreenImage1" name="homeScreenImage1" />

                    <label htmlFor="homeScreenImage2">Home Screen Image 2:</label>
                    <input type="file" id="homeScreenImage2" name="homeScreenImage2" />

                    <label htmlFor="homeScreenImage3">Home Screen Image 3:</label>
                    <input type="file" id="homeScreenImage3" name="homeScreenImage3" />
                  </div>
                </div>

                <div className="admin-config-form-column">
                  {/* Right Side */}
                  <div className="admin-config-form-group">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <Field type="text" id="contactNumber" name="contactNumber" />
                    <ErrorMessage name="contactNumber" component="div" className="error" />

                    <label htmlFor="contactAddress">Contact Address:</label>
                    <Field type="text" id="contactAddress" name="contactAddress" />
                    <ErrorMessage name="contactAddress" component="div" className="error" />

                    <label htmlFor="emailId">Email ID:</label>
                    <Field type="email" id="emailId" name="emailId" />
                    <ErrorMessage name="emailId" component="div" className="error" />

                    <label htmlFor="noOfSlots">Number of Slots:</label>
                    <Field type="text" id="noOfSlots" name="noOfSlots" />
                    <ErrorMessage name="noOfSlots" component="div" className="error" />
                  </div>
                </div>
                <button type="submit">Save</button>
              </Form>
            )}
          </Formik>
        )}

        {activeTab === 'roles' && (
          <div>
            <button
              className="admin-config-add-role-button"
              onClick={() => setIsDialogOpen(true)}
            >
              Add Role
            </button>
            <table className="admin-config-roles-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Features</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <tr key={index}>
                    <td>{role.name}</td>
                    <td>{role.features}</td>
                    <td>
                      <button
                        className="admin-config-edit-button"
                        onClick={() => handleEditRole(index)}
                      >
                        <i className="pi pi-pencil"></i>
                      </button>
                      <button
                        className="admin-config-delete-button"
                        onClick={() => handleDeleteRole(index)}
                      >
                        <i className="pi pi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {isDialogOpen && (
              <div className="admin-config-role-dialog">
                <h2>{editingRole !== null ? 'Edit Role' : 'Add New Role'}</h2>
                <Formik
                  initialValues={newRole}
                  validationSchema={roleValidationSchema}
                  onSubmit={handleSaveRole}
                >
                  {() => (
                    <Form>
                      <label htmlFor="name">Role Name:</label>
                      <Field type="text" id="name" name="name" />
                      <ErrorMessage name="name" component="div" className="error" />

                      <label htmlFor="features">Role Features:</label>
                      <Field type="text" id="features" name="features" />
                      <ErrorMessage name="features" component="div" className="error" />

                      <button type="submit">Save</button>
                      <button type="button" className='cancel-buttonn' onClick={() => setIsDialogOpen(false)}>Cancel</button>
                    </Form>
                  )}
                </Formik>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConfigurationForm;
