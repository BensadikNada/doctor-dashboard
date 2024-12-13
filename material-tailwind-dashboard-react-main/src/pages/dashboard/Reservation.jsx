import React, { useState, useEffect } from 'react';
import CustomTable from '@/widgets/tables/table';
import axiosClient from '@/hooks/axiosClient';
import ReservationModal from '@/widgets/model/reservation';

export function Reservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchReservations = async () => {
    try {
      const response = await axiosClient.get('reservations');
      setReservations(response.data.map(reservation => ({
        ...reservation,
        reservation_date: new Date(reservation.reservation_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      })));
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const generateColumns = () => {
    const columns = [
      { uid: 'patient', name: 'Patient Name', sortable: true },
      { uid: 'reservation_date', name: 'Reservation Date', sortable: true },
      { uid: 'heure', name: 'Heure', sortable: true },
      { uid: 'to_heure', name: 'heure de fini', sortable: true },
      { uid: 'actions', name: 'Actions', sortable: false },
    ];
    
    return columns;
  };
  
  const handleOpenModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this reservation? This action cannot be undone.");
    if (isConfirmed) {
      try {
        await axiosClient.delete(`reservations/${id}`);
        fetchReservations(); 
        console.log("Reservation deleted successfully");
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  return (
    <div>
      <CustomTable handleDelete={handleDelete} onAdd={handleOpenModal} columns={generateColumns()} data={reservations} />
      <ReservationModal fetchReservations={fetchReservations} isOpen={isModalOpen} onClose={handleCloseModal} reservation={selectedReservation} />
    </div>
  );
}

export default Reservation;