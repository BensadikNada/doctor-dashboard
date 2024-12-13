import React, { useState, useEffect } from 'react';
import CustomTable from '@/widgets/tables/table';
import axiosClient from '@/hooks/axiosClient';
import ReservationModal from '@/widgets/model/reservation';

export function RendezVous() {
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
      { uid: 'reservation_date', name: 'Date de réservation', sortable: true },
      { uid: 'heure', name: 'Heure', sortable: true },
      { uid: 'to_heure', name: 'Heure de fin', sortable: true },
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
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action ne peut pas être annulée.");
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
      <CustomTable handleDelete={handleDelete} onAdd={null} columns={generateColumns()} data={reservations} />
    </div>
  );
}

export default RendezVous;
