import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify'; // Ensure you have react-toastify installed
import './NewMemberRegistration.css';

const NewMemberRegistration = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Formik validation schema using Yup
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    schoolOrCompany: Yup.string().required('School/Company Name is required'),
    city: Yup.string().required('City is required'),
    area: Yup.string().required('Area is required'),
    state: Yup.string().required('State is required'),
    pincode: Yup.string()
      .required('Pincode is required')
      .matches(/^[0-9]{6}$/, 'Invalid pincode'),
    parentOrGuardian: Yup.string().required('Parent/Guardian Name is required'),
    coachingMembership: Yup.string().required('Coaching or Membership is required'),
    contact: Yup.string()
      .required('Contact is required')
      .matches(/^[0-9]{10}$/, 'Invalid contact number'),
    address: Yup.string().required('Address is required'),
    aadharUpload: Yup.mixed().required('Aadhar upload is required'),
    photoUpload: Yup.mixed().required('Photo upload is required'),
    packageType: Yup.string().required('Package type is required'),
    packageStartDate: Yup.date().required('Package start date is required'),
    packageActualStartDate: Yup.date().required('Package actual start date is required'),
    packageEndDate: Yup.date().required('Package end date is required'),
    amount: Yup.number()
      .required('Amount is required')
      .min(1, 'Amount must be greater than 0'),
    discount: Yup.number()
      .min(0, 'Discount must be positive')
      .max(100, 'Discount cannot exceed 100%'),
    paymentType: Yup.string().required('Payment type is required'),
    paymentStatus: Yup.string().required('Payment status is required'),
    discountedAmount: Yup.number().min(0, 'Discounted amount must be positive'),
    roundedAmount: Yup.number().min(0, 'Rounded amount must be positive'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      firstName: '',
      lastName: '',
      schoolOrCompany: '',
      city: '',
      area: '',
      state: 'Karnataka', // set a default value
      pincode: '',
      parentOrGuardian: '',
      coachingMembership: '',
      contact: '',
      address: '',
      aadharUpload: null, // or ''
      photoUpload: null, // or ''
      packageType: '',
      packageStartDate: '',
      packageActualStartDate: '',
      packageEndDate: '',
      amount: '',
      discount: '',
      discountedAmount: '',  // Ensure this has a value too, even if read-only
      roundedAmount: '',     // Ensure this has a value too, even if read-only
      paymentType: '',
      paymentStatus: '',
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission logic here
      // For example, you might want to send the form data to an API
      console.log('Form Values:', values);
      toast.success('Form submitted successfully!');
    },
  });

  const handleSendOtp = () => {
    if (formik.values.contact.length === 10) {
      toast.success(`OTP sent to +91${formik.values.contact}`, { autoClose: 2000 });
      setOtpSent(true);
    } else {
      toast.error('Please enter a valid 10-digit phone number.', { autoClose: 2000 });
    }
  };

  const handleVerifyOtp = () => {
    // Implement actual OTP verification logic here
    if (otp === '123456') { // Example OTP check
      toast.success('OTP verified successfully!', { autoClose: 2000 });
    } else {
      toast.error('Invalid OTP. Please try again.', { autoClose: 2000 });
    }
  };

  // Compute Discounted Amount and Rounded Amount whenever Amount or Discount changes
  useEffect(() => {
    const amount = parseFloat(formik.values.amount);
    const discount = parseFloat(formik.values.discount);
    if (!isNaN(amount) && !isNaN(discount)) {
      const discounted = amount - (amount * discount) / 100;
      formik.setFieldValue('discountedAmount', discounted.toFixed(2));
      const rounded = Math.round(discounted);
      formik.setFieldValue('roundedAmount', rounded);
    } else {
      formik.setFieldValue('discountedAmount', '');
      formik.setFieldValue('roundedAmount', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.amount, formik.values.discount]);

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h2 className="h2name">Member Registration</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-blocks">
            {/* Personal Information */}
            <div className="form-block personal-info">
              <h3>Personal Information</h3>

              {/* Render form fields */}
              {[
                { label: "Title", type: "select", options: ["", "Mr.", "Mrs."], id: "title" },
                { label: "First Name", type: "text", id: "firstName" },
                { label: "Last Name", type: "text", id: "lastName" },
                { label: "School/Company Name", type: "text", id: "schoolOrCompany" },
                { label: "City", type: "select", options: ["", "Bangalore", "Mysore"], id: "city" },
                { label: "Area", type: "select", options: ["", "Area 1", "Area 2"], id: "area" },
                { label: "State", type: "text", id: "state", value: "Karnataka", readOnly: true },
                { label: "Pincode", type: "text", id: "pincode" },
                { label: "Parent/Guardian Name", type: "text", id: "parentOrGuardian" },
                { label: "Coaching or Membership", type: "text", id: "coachingMembership" },
              ].map(({ label, type, options, id, ...rest }) => (
                <div className="form-group" key={id}>
                  <label htmlFor={id}>{label}:</label>
                  {type === 'select' ? (
                    <select
                      name={id}
                      id={id}
                      {...formik.getFieldProps(id)}
                    >
                      {options.map((option, index) => (
                        <option key={index} value={option === "" ? "" : option}>{option === "" ? `Select ${label}` : option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      id={id}
                      {...formik.getFieldProps(id)}
                      readOnly={rest.readOnly}
                    />
                  )}
                  {formik.touched[id] && formik.errors[id] && <div className="error">{formik.errors[id]}</div>}
                </div>
              ))}

              {/* Contact field with OTP */}
              <div className="form-group">
  <label htmlFor="contact">Contact:</label>
  <div className="contact-group">
    <input
      type="text"
      name="countryCode"
      id="countryCode"
      defaultValue="+91"
      readOnly
      className="country-code"
    />
    <input
      type="text"
      id="contact"
      placeholder="Enter 10-digit number"
      maxLength={10}
      value={formik.values.contact || ''} // Ensure it's controlled
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
    />
    <button type="button" className="send-btn" onClick={handleSendOtp}>Send OTP</button>
  </div>
  {formik.touched.contact && formik.errors.contact && <div className="error">{formik.errors.contact}</div>}
</div>


              {/* OTP Verification */}
              {otpSent && (
                <div className="form-group">
                  <label htmlFor="otp">OTP:</label>
                  <div className="otp-group">
                    <input
                      type="text"
                      id="otp"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />
                    <button type="button" className="otp-btn-verify" onClick={handleVerifyOtp}>Verify OTP</button>
                  </div>
                </div>
              )}

              {/* Address and file uploads */}
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <textarea
                  name="address"
                  id="address"
                  rows="4"
                  {...formik.getFieldProps('address')}
                ></textarea>
                {formik.touched.address && formik.errors.address && <div className="error">{formik.errors.address}</div>}
              </div>
              {[
                { label: "Upload Aadhar", id: "aadharUpload", accept: ".pdf,.jpg,.jpeg,.png" },
                { label: "Upload Photo", id: "photoUpload", accept: ".jpg,.jpeg,.png" },
              ].map(({ label, id, accept }) => (
                <div className="form-group" key={id}>
                  <label htmlFor={id}>{label}:</label>
                  <input
                    type="file"
                    id={id}
                    accept={accept}
                    onChange={(e) => formik.setFieldValue(id, e.currentTarget.files[0])}
                  />
                  {formik.touched[id] && formik.errors[id] && <div className="error">{formik.errors[id]}</div>}
                </div>
              ))}
            </div>

            {/* Package Information */}
            <div className="form-block package-info">
              <h3>Package Information</h3>
              {[
                { label: "Package Type", type: "select", options: ["", "Basic", "Standard", "Premium"], id: "packageType" },
                { label: "Package Start Date", type: "date", id: "packageStartDate" },
                { label: "Package Actual Start Date", type: "date", id: "packageActualStartDate" },
                { label: "Package End Date", type: "date", id: "packageEndDate" },
                { label: "Package Extended Date", type: "date", id: "packageExtendedDate" },
              ].map(({ label, type, options, id, ...rest }) => (
                <div className="form-group" key={id}>
                  <label htmlFor={id}>{label}:</label>
                  {type === 'select' ? (
                    <select
                      name={id}
                      id={id}
                      {...formik.getFieldProps(id)}
                    >
                      {options.map((option, index) => (
                        <option key={index} value={option === "" ? "" : option}>{option === "" ? `Select ${label}` : option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      id={id}
                      {...formik.getFieldProps(id)}
                    />
                  )}
                  {formik.touched[id] && formik.errors[id] && <div className="error">{formik.errors[id]}</div>}
                </div>
              ))}
            </div>

            {/* Payment Information */}
            <div className="form-block payment-info">
              <h3>Payment Information</h3>
              {[
                { label: "Actual Amount (₹)", type: "number", id: "amount", required: true },
                { label: "Discount (%)", type: "number", id: "discount", required: true },
                { label: "Discounted Amount (₹)", type: "number", id: "discountedAmount", readOnly: true },
                { label: "Rounded Amount (₹)", type: "number", id: "roundedAmount", readOnly: true },
                { label: "Payment Type", type: "select", options: ["", "Cash", "Cheque", "UPI", "Card"], id: "paymentType", required: true },
                { label: "Payment Status", type: "select", options: ["", "Completed", "Pending"], id: "paymentStatus", required: true },
              ].map(({ label, type, options, id, required, readOnly }) => (
                <div className="form-group" key={id}>
                  <label htmlFor={id}>{label}:</label>
                  {type === 'select' ? (
                    <select
                      name={id}
                      id={id}
                      {...formik.getFieldProps(id)}
                    >
                      {options.map((option, index) => (
                        <option key={index} value={option === "" ? "" : option}>{option === "" ? `Select ${label}` : option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={id}
                      id={id}
                      {...formik.getFieldProps(id)}
                      readOnly={readOnly}
                      required={required}
                    />
                  )}
                  {formik.touched[id] && formik.errors[id] && <div className="error">{formik.errors[id]}</div>}
                </div>
              ))}
            </div>

         
          </div>
          <button type="submit" className="submit-btn">Submit</button>
          <button type="button" className="schedule-btn">Schedule</button>
        </form>
      </div>
    </div>
  );
};

export default NewMemberRegistration;
