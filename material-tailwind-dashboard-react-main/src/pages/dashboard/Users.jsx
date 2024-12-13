import React, { useState, useEffect } from 'react';
import CustomTable from '@/widgets/tables/table';
import axiosClient from '@/hooks/axiosClient';
import PatientModal from '@/widgets/model/patient';
import { PatientSalleDAttenteDialog } from '@/widgets/dialog/SalleDattente';
import { PatientInfoDialog } from '@/widgets/dialog/PatientInfoDialog';

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedpatient, setSelectedpatient] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpeninfo, setIsDialogOpeninfo] = useState(false);
  const handleDialogClose = () => setIsDialogOpen(false);
  const handleDialogCloseUsers = () => setIsDialogOpeninfo(false);


  const fetchUsers = async () => {
      try {
        const response = await axiosClient.get('patients');
        setUsers(response.data.map(user => ({
          ...user,
          created_at: new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        })));
        console.log(response.data)
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  const generateColumns = () => {
    const columns = [
      { uid: 'nom', name: 'Nom', sortable: true },
      { uid: 'prenom', name: 'Prénom', sortable: true },
      { uid: 'telephone', name: 'Téléphone', sortable: true },
      { uid: 'CIN', name: 'CIN', sortable: true },
      { uid: 'age', name: 'Âge', sortable: true },
      { uid: 'sexe', name: 'Sexe', sortable: true },
      { uid: 'adresse', name: 'Adresse', sortable: true },
      { uid: 'dateArrive', name: 'Date d\'Arrivée', sortable: true },
      { uid: 'heure', name: 'Heure', sortable: true },
      { uid: 'etat_maladie', name: 'État de la Maladie', sortable: true },
      { uid: 'etat_patient', name: 'État du Patient', sortable: true },
      { uid: 'created_at', name: 'Date de Création', sortable: true },
      { uid: 'actions', name: 'Actions', sortable: false }, 
    ];
    
    return columns;
  };
  

  const handleOpenModal = (event) => {
    setSelectedpatient(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this patient? This action cannot be undone.");
    if (isConfirmed) {
      try {
        await axiosClient.delete(`patients/${id}`);
        fetchUsers(); 
        console.log("Patient deleted successfully");
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };
  
  const handleDialogOpen = (event) => {
    setSelectedpatient(event);
    setIsDialogOpen(true); 
  };
  const handleDialogUsersopen = (event) => {
    setSelectedpatient(event);
    setIsDialogOpeninfo(true); 
  };
  
  return (
    <div>
      <CustomTable handleDelete={handleDelete} handleDialogUsers={handleDialogUsersopen} handleDialogOpen={handleDialogOpen} onAdd={handleOpenModal} columns={generateColumns()} data={users} />
      <PatientModal fetchPatients={fetchUsers} isOpen={isModalOpen} onClose={handleCloseModal} patient={selectedpatient} />
      <PatientSalleDAttenteDialog fetchPatients={fetchUsers} isOpen={isDialogOpen} onClose={handleDialogClose} patient={selectedpatient} />   
      <PatientInfoDialog  fetchPatients={fetchUsers} isOpen={isDialogOpeninfo} onClose={handleDialogCloseUsers} patient={selectedpatient} />   
    </div>
  );
}

export default Users;
