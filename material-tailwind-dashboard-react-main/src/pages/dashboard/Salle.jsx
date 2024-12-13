import React, { useState, useEffect } from 'react';
import CustomTable from '@/widgets/tables/table';
import axiosClient from '@/hooks/axiosClient';
import { PatientInfoDialog } from '@/widgets/dialog/PatientInfoDialog';

export const SalleDAttente = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedpatient, setSelectedpatient] = useState(null);
  const [isDialogOpeninfo, setIsDialogOpeninfo] = useState(false);
  const handleDialogCloseUsers = () => setIsDialogOpeninfo(false);
  const handleDialogUsersopen = (event) => {
    setSelectedpatient(event);
    setIsDialogOpeninfo(true); 
  };
  
  
  const fetchPatients = async () => {
    try {
      const response = await axiosClient.get('salles/patients');
      setPatients(response.data);
      console.log(response.data)
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const generateColumns = () => {
    const columns = [
      { uid: 'nom', name: 'Nom', sortable: true },
      { uid: 'prenom', name: 'Prénom', sortable: true },
      { uid: 'heure', name: 'Heure', sortable: true },
      { uid: 'actions', name: 'Actions', sortable: false }, 
    ];
    
    return columns;
  };

  const removePatient = async (patientId) => {
    try {
      
      let salleId=1;
      await axiosClient.delete(`salles/${salleId}/remove-patient/${patientId}`);
      fetchPatients(); 
    } catch (error) {
      console.error('Error removing patient from SalleDAttente:', error);
    }
  };
  



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <CustomTable handleDelete={removePatient} onAdd={null} columns={generateColumns()} data={patients} handleDialogUsers={handleDialogUsersopen}/>
      <PatientInfoDialog fetchPatients={fetchPatients} isOpen={isDialogOpeninfo} onClose={handleDialogCloseUsers} patient={selectedpatient} />   
    </div>
  );
}

export default SalleDAttente;
