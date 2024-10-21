import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./GuestRegistrationForm.css";

const GuestScreen = () => {
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);

  const sendOtp = (contact) => {
    alert(`OTP sent to ${contact}`);
    setIsOtpSent(true);
    setIsOtpVisible(true);
  };

  const validateOtp = (otp) => {
    if (otp === '1234') {
      alert('OTP is valid');
      setIsOtpValid(true);
    } else {
      alert('Invalid OTP');
      setIsOtpValid(false);
    }
  };

  const initialValues = {
    GuestRegistration :{
    firstName: '',
    lastName: '',
    contact: '+91',
    otp: '',
    gender: '',
    amount: '',
    paymentType: '',
    transactionId: ''
  }
  }
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    contact: Yup.string().required('Contact is required'),
    otp: Yup.string()
      .required('OTP is required')
      .when('isOtpSent', {
        is: true,
        then: Yup.string().min(4, 'OTP must be at least 4 digits'),
      }),
    gender: Yup.string().required('Gender is required'),
    amount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive'),
    paymentType: Yup.string().required('Payment Type is required'),
    transactionId: Yup.string().required('Transaction ID is required'),
  });

  const handleSubmit = (values) => {
    if (!isOtpValid) {
      alert('Please validate the OTP before saving.');
      return;
    }
    alert('Form saved successfully!');
    console.log('Form values:', values);
  };

  return (
    <div className="guest-registration-form">
      <h2>Guest Registration</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="guest-form-group">
              <label htmlFor="firstName">First Name</label>
              <Field
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
              />
              <ErrorMessage name="firstName" component="div" className="error" />
            </div>
            <div className="guest-form-group">
              <label htmlFor="lastName">Last Name</label>
              <Field
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
              />
              <ErrorMessage name="lastName" component="div" className="error" />
            </div>
            <div className="guest-form-group">
              <label htmlFor="contact">Contact Number</label>
              <Field
                type="tel"
                id="contact"
                name="contact"
                placeholder="Enter your contact number"
              />
              <ErrorMessage name="contact" component="div" className="error" />
              
              <button
                type="button"
                onClick={() => sendOtp(values.contact)}
                className="guest-send-otp-btn"
              >
                Send OTP
              </button>
            </div>
            {isOtpVisible && (
              <div className="guest-form-group">
                <Field
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                />
                <ErrorMessage name="otp" component="div" className="error" />
                <button
                  type="button"
                  onClick={() => validateOtp(values.otp)}
                  disabled={!isOtpSent}
                >
                  Validate OTP
                </button>
              </div>
            )}
            <div className="guest-form-group">
              <label>Gender</label>
              <Field as="select" name="gender" id="gender">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="error" />
            </div>
            <div className="guest-form-group">
              <label htmlFor="amount">Amount</label>
              <Field type="number" id="amount" name="amount" placeholder="Enter amount" />
              <ErrorMessage name="amount" component="div" className="error" />
            </div>
            <div className="guest-form-group">
              <label>Payment Type</label>
              <Field as="select" name="paymentType" id="paymentType">
                <option value="">Select Payment Type</option>
                <option value="cash">Cash</option>
                <option value="scan">Scan</option>
              </Field>
              <ErrorMessage name="paymentType" component="div" className="error" />
            </div>
            <div className="guest-form-group">
              <label htmlFor="transactionId">Transaction ID</label>
              <Field type="text" id="transactionId" name="transactionId" placeholder="Enter transaction ID" />
              <ErrorMessage name="transactionId" component="div" className="error" />
            </div>
            <div className="guest-form-group">
              <button
                type="button"
                className="guest-schedule-btn"
                onClick={() => alert('Scheduling...')}
              >
                Schedule
              </button>
            </div>
            <div className="guest-form-group">
              <button type="submit" className="guest-otp-btn">
                Save
              </button>
              
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GuestScreen;
