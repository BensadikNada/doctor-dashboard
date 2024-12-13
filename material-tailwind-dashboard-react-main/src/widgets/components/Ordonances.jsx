import React, { useState, useEffect } from 'react';
import CustomTable from '@/widgets/tables/table';
import axiosClient from '@/hooks/axiosClient';
import AjouteOrdonance from './AjouteOrdonance';

export function Ordonances({ patient }) {
  const [ordonances, setOrdonances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingOrdonance, setIsAddingOrdonance] = useState(false); 
  const [selectedOrdonanceData, setSelectedOrdonanceData] = useState(null); 

  const fetchOrdonances = async () => {
    try {
      const response = await axiosClient.get(`Ordonances?patient_id=${patient.id}`);
      setOrdonances(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdonances();
  }, [patient.id]);

  const generateColumns = () => {
    const columns = [
      { uid: 'date', name: 'Date', sortable: true },
      { uid: 'description', name: 'Description', sortable: true },
      { uid: 'actions', name: 'Actions', sortable: false },
    ];
    return columns;
  };

  const handleAddOrdonance = (ordonanceData) => {
    console.log(ordonanceData)
    setIsAddingOrdonance(true);
    setSelectedOrdonanceData(ordonanceData); 
  }

  const handleCloseAjouteOrdonance = () => {
    setIsAddingOrdonance(false);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette ordonnance ? Cette action ne peut pas être annulée.");
    // console.log(id)
    if (isConfirmed) {
      try {
        await axiosClient.delete(`/ordonancess/${id}`);
        fetchOrdonances(); 
      } catch (error) {
        console.error('Error deleting ordonnance:', error);
      }
    }
  };



  return (
    <div>
      {!isAddingOrdonance && 
        <CustomTable 
          handleDelete={handleDelete} 
          onAdd={handleAddOrdonance} 
          columns={generateColumns()} 
          data={ordonances} 
        />
      }
      {isAddingOrdonance && 
        <AjouteOrdonance 
          fetchOrdonances={fetchOrdonances} 
          onClose={handleCloseAjouteOrdonance} 
          patientId={patient.id} 
          ordonanceData={selectedOrdonanceData}  
        />
      }
    </div>
  );
}

export default Ordonances;
