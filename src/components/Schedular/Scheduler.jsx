import React, { useState, createContext, useContext } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Scheduler.css';

const SchedulerContext = createContext();

export const SchedulerProvider = ({ children }) => {
  const [guestData, setGuestData] = useState({});

  return (
    <SchedulerContext.Provider value={{ guestData, setGuestData }}>
      {children}
    </SchedulerContext.Provider>
  );
};

export const useScheduler = () => {
  return useContext(SchedulerContext);
};

const Scheduler = () => {
  const { guestData, setGuestData } = useScheduler();
  const [date, setDate] = useState(new Date());
  const [activeTable, setActiveTable] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [hoveredCell, setHoveredCell] = useState({ row: null, col: null });
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const formattedDate = date.toDateString();

  const getInitialGuestNames = () => ({
    morning: Array(5).fill(null).map(() => Array(10).fill('')),
    evening: Array(6).fill(null).map(() => Array(10).fill('')),
    guest: Array(1).fill(null).map(() => Array(10).fill(''))
  });

  const handleDateChange = (e) => {
    const newDate = e.value;
    setDate(newDate);

    if (!guestData[newDate.toDateString()]) {
      setGuestData({
        ...guestData,
        [newDate.toDateString()]: getInitialGuestNames(),
      });
    }
  };

  const handleButtonClick = (table) => setActiveTable(table);

  const handleEditGuest = () => {
    const currentGuest = guestData[formattedDate]?.[activeTable]?.[selectedColumn]?.[selectedRow];
    if (currentGuest) {
      const [name, occurrence] = currentGuest.split(' - ');
      formik.setValues({ name, occurrence: new Date(occurrence) });
      setIsEditing(true);
      setShowDialog(true);
    }
  };

  const handleDeleteGuest = () => {
    const updatedNames = guestData[formattedDate][activeTable].map((slot, idx) =>
      idx === selectedColumn
        ? slot.map((name, i) => (i === selectedRow ? '' : name))
        : slot
    );

    setGuestData({
      ...guestData,
      [formattedDate]: {
        ...guestData[formattedDate],
        [activeTable]: updatedNames,
      },
    });
  };

  const calculateOccupancyRate = (slotData) => {
    const totalCells = 10;
    const filledCells = slotData.filter((name) => name !== '').length;
    return (filledCells / totalCells) * 100;
  };

  const renderTable = (times) => (
    <table>
      <thead>
        <tr>
          {times.map((time, index) => {
            const slotData = guestData[formattedDate]?.[activeTable]?.[index] || [];
            const occupancyRate = calculateOccupancyRate(slotData);
            const availableSlots = 10 - slotData.filter((name) => name !== '').length;

            const getStatusColor = (rate) => {
              if (rate === 100) return 'red';
              if (rate > 60) return 'yellow';
              return 'green';
            };

            const statusColor = getStatusColor(occupancyRate);

            return (
              <th key={index}>
                {time}
                <span
                  id={`status-circle-${index}`}
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    marginLeft: '8px',
                    borderRadius: '50%',
                    backgroundColor: statusColor,
                    position: 'relative'
                  }}
                ></span>
                <Tooltip
                  target={`#status-circle-${index}`}
                  content={`${availableSlots} slots available`}
                  position="top"
                />
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 10 }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {times.map((_, colIndex) => {
              const cellContent = guestData[formattedDate]?.[activeTable]?.[colIndex]?.[rowIndex] || '';

              return (
                <td
                  key={colIndex}
                  onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                  onMouseLeave={() => setHoveredCell({ row: null, col: null })}
                >
                  <InputText value={cellContent} disabled />
                  {hoveredCell.row === rowIndex && hoveredCell.col === colIndex && (
                    <div className="cell-buttons">
                      {!cellContent && (
                        <Button
                          icon="pi pi-plus"
                          className="p-button-sm p-button-rounded"
                          onClick={() => {
                            setIsEditing(false);
                            setSelectedRow(rowIndex);
                            setSelectedColumn(colIndex);
                            setShowDialog(true);
                            formik.resetForm();
                          }}
                        />
                      )}
                      {cellContent && (
                        <>
                          <Button
                            icon="pi pi-pencil"
                            className="p-button-sm p-button-rounded"
                            onClick={() => {
                              setSelectedRow(rowIndex);
                              setSelectedColumn(colIndex);
                              handleEditGuest();
                            }}
                          />
                          <Button
                            icon="pi pi-trash"
                            className="p-button-sm p-button-rounded"
                            onClick={() => {
                              setSelectedRow(rowIndex);
                              setSelectedColumn(colIndex);
                              handleDeleteGuest();
                            }}
                          />
                        </>
                      )}
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const formik = useFormik({
    initialValues: { name: '', occurrence: new Date() },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      occurrence: Yup.date().required('Occurrence date is required').min(new Date(), 'Occurrence date cannot be in the past'),
    }),
    onSubmit: (values) => {
      console.log('Form Data:', values);

      if (selectedRow === null || selectedColumn === null) return;

      const newData = { ...guestData };

      let currentDate = new Date(date);
      const endDate = new Date(values.occurrence);

      while (currentDate <= endDate) {
        const currentFormattedDate = currentDate.toDateString();

        if (!newData[currentFormattedDate]) {
          newData[currentFormattedDate] = getInitialGuestNames();
        }

        const updatedNames = newData[currentFormattedDate][activeTable].map((slot, idx) =>
          idx === selectedColumn
            ? slot.map((name, i) =>
                i === selectedRow ? `${values.name} - ${values.occurrence.toLocaleDateString()}` : name)
            : slot
        );

        newData[currentFormattedDate] = {
          ...newData[currentFormattedDate],
          [activeTable]: updatedNames,
        };

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setGuestData(newData);
      setShowDialog(false);
      formik.resetForm();
    },
  });

  return (
    <div className="scheduler-container">
      <div className="calendar-button-container">
        <div className="calendar-container">
          <Calendar value={date} onChange={handleDateChange} showButtonBar />
        </div>
        <div className="button-group">
          <Button label="Morning Batch" onClick={() => handleButtonClick('morning')} />
          <Button label="Evening Batch" onClick={() => handleButtonClick('evening')} />
          <Button label="Guest Batch" onClick={() => handleButtonClick('guest')} />
        </div>
      </div>

      {activeTable === 'morning' && renderTable(['6.00-7.00AM', '7.00-8.00AM', '8.00-9.00AM', '9.00-10.00AM', '10.00-11.00AM'])}
      {activeTable === 'evening' && renderTable(['2.00-3.00PM', '3.00-4.00PM', '4.00-5.00PM', '5.00-6.00PM', '6.00-7.00PM', '7.00-8.00PM'])}
      {activeTable === 'guest' && renderTable(['11AM-2PM'])}

      <Dialog header={isEditing ? "Edit Guest" : "Add Guest"} visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.name && formik.errors.name ? 'p-invalid' : ''}
            />
            {formik.touched.name && formik.errors.name && <small className="p-error">{formik.errors.name}</small>}
          </div>
          <div className="p-field">
            <label htmlFor="occurrence">Occurrence</label>
            <Calendar
              id="occurrence"
              value={formik.values.occurrence}
              onChange={(e) => formik.setFieldValue('occurrence', e.value)}
              minDate={new Date()}
            />
            {formik.touched.occurrence && formik.errors.occurrence && <small className="p-error">{formik.errors.occurrence}</small>}
          </div>
          <Button type="submit" label="Save" icon="pi pi-check" />
        </form>
      </Dialog>
    </div>
  );
};

export default Scheduler;