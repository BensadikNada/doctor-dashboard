import React, { useState, useEffect } from 'react';
import CustomTable from '@/widgets/tables/table';
import axiosClient from '@/hooks/axiosClient';
import { PatientInfoDialog } from '@/widgets/dialog/PatientInfoDialog';
import AjouteConsultation from './AjouteConsulation';


export const Consultation = ({patient}) => {
  const [consultations, setConsultations] = useState([]); // State for storing consultations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const fetchConsultations = async () => {
    try {
      const response = await axiosClient.get('consultations'); // Assuming the endpoint is 'consultations'
      setConsultations(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);
  const generateColumns = () => {
    const columns = [
      { uid: 'patient', name: 'Patient', sortable: true },
      { uid: 'consultation_date', name: 'Date de consultation', sortable: true },
      { uid: 'start_time', name: 'Heure de début', sortable: true },
      { uid: 'end_time', name: 'Heure de fin', sortable: true },
      { uid: 'diagnosis', name: 'Diagnostic', sortable: true },
      { uid: 'prescription', name: 'Ordonnance', sortable: true },
      { uid: 'notes', name: 'Notes', sortable: true },
      { uid: 'consultation_fee', name: 'Frais de consultation', sortable: true },
      { uid: 'follow_up_needed', name: 'Suivi nécessaire', sortable: true },
      { uid: 'follow_up_date', name: 'Date de suivi', sortable: true },
      { uid: 'body_temperature', name: 'Température corporelle', sortable: true },
      { uid: 'body_weight_kg', name: 'Poids corporel (kg)', sortable: true },
      { uid: 'blood_pressure', name: 'Pression artérielle', sortable: true },
      { uid: 'blood_sugar', name: 'Sucre dans le sang', sortable: true },
      { uid: 'symptoms', name: 'Symptômes', sortable: true },
      { uid: 'medical_history', name: 'Antécédents médicaux', sortable: true },
      { uid: 'allergies', name: 'Allergies', sortable: true },
      { uid: 'lab_tests', name: 'Tests de laboratoire', sortable: true },
      { uid: 'family_medical_history', name: 'Antécédents médicaux familiaux', sortable: true },
      { uid: 'actions', name: 'Actions', sortable: false },
  ];
    
    return columns;
  };
  
  const handleOpenModal = (consultation) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette consultation ? Cette action ne peut pas être annulée.");
    if (isConfirmed) {
      try {
        await axiosClient.delete(`consultations/${id}`);
        fetchConsultations(); 
        console.log("Consultation supprimée avec succès.");
      } catch (error) {
        console.error('Error deleting consultation:', error);
      }
    }
  };

  return (
    <div>
   {isModalOpen ? (
  <AjouteConsultation fetchConsultations={fetchConsultations} isOpen={isModalOpen} onClose={handleCloseModal} consultation={selectedConsultation} patientId={patient} />
) : (
  <CustomTable  handleDelete={handleDelete} onAdd={handleOpenModal} columns={generateColumns()} data={consultations} />
)}
    </div>
  );
};

export default Consultation;
