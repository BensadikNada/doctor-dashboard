import React, { useState, useEffect } from 'react';
import CustomTable from '@/widgets/tables/table';
import axiosClient from '@/hooks/axiosClient';
import AjoutePaiment from './AjoutePaiment';

const Paiment = ({ patient }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const fetchConsultations = async () => {
    try {
      const response = await axiosClient.get('consultations');
      const consultationsWithTotalPaidAmount = await Promise.all(
        response.data.map(async (consultation) => {
          const paymentsResponse = await axiosClient.get(`consultations/${consultation.id}/payments`);
          const totalPaidAmount = paymentsResponse.data.reduce((total, payment) => total + parseFloat(payment.amount_paid), 0);
          const amountRemaining = parseFloat(consultation.consultation_fee) - totalPaidAmount;
          return { ...consultation, total_paid_amount: totalPaidAmount, amount_remaining: amountRemaining };
        })
      );
      setConsultations(consultationsWithTotalPaidAmount);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleOpenModal = (consultation) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette consultation ? Cette action ne peut pas être annulée.");
    if (isConfirmed) {
      try {
        await axiosClient.delete(`consultations/${id}`);
        fetchConsultations();
        console.log("Consultation deleted successfully");
      } catch (error) {
        console.error('Error deleting consultation:', error);
      }
    }
  };

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur : {error}</div>;

  if (consultations.length === 0) {
    return (
      <div>
        <p>Aucune consultation à payer.</p>
      </div>
    );
  }

  const generateColumns = () => {
    return [
      { uid: 'patient', name: 'Patient', sortable: true },
      { uid: 'consultation_date', name: 'Date de consultation', sortable: true },
      { uid: 'consultation_fee', name: 'Frais de consultation', sortable: true },
      { uid: 'total_paid_amount', name: 'Montant total payé', sortable: true },
      { uid: 'amount_remaining', name: 'Montant restant', sortable: true },
      { uid: 'actions', name: 'Actions', sortable: false },
    ];
  };

  return (
    <div>
      {isModalOpen ? (
        <AjoutePaiment fetchConsultations={fetchConsultations} isOpen={isModalOpen} onClose={handleCloseModal} consultation={selectedConsultation} patientId={patient} />
      ) : (
        <CustomTable handleDelete={handleDelete} onAdd={handleOpenModal} columns={generateColumns()} data={consultations} />
      )}
    </div>
  );
};

export default Paiment;
