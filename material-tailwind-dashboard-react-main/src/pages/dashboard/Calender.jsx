import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calender/styles.css';
import axiosClient from '@/hooks/axiosClient';

const localizer = momentLocalizer(moment); 

export const Calender = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
   const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('reservations');
        setReservations(response.data.map(reservation => {
          const startDateTime = moment(`${reservation.reservation_date} ${reservation.heure}`, "YYYY-MM-DD HH:mm:ss").toDate();
          const endDateTime =  moment(`${reservation.reservation_date} ${reservation.to_heure}`, "YYYY-MM-DD HH:mm:ss").toDate();
  
          return {
            title: `Reservation de ${reservation.patient.nom} ${reservation.patient.prenom}`,
            start: startDateTime,
            end: endDateTime, 
            resource: reservation.heure,
          };
        }));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  useEffect(() => {

    fetchReservations();
  }, []);
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='w-full h-[90vh] bg-white p-4 rounded-lg'>
      <Calendar
        localizer={localizer}
        events={reservations}
        startAccessor="start"
        endAccessor="end"
        resourceAccessor="resource" // Use resourceAccessor to display the heure field
        style={{ height: '100%', width: '100%' }} 
      />
    </div>
  );
};

export default Calender;