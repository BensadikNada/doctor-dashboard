import React, { useState, useEffect } from 'react';
import axiosClient from '@/hooks/axiosClient';
import { Input, Textarea, Button } from '@nextui-org/react';

const AjouteOrdonance = ({ onClose, fetchOrdonances, patientId, ordonanceData }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (ordonanceData) {
      setDate(ordonanceData.date);
      setDescription(ordonanceData.description);
    }
  }, [ordonanceData]);

  const handleSubmit = async () => {
    try {
      const ordonanceFormData = {
        patient_id: patientId,
        date,
        description,
      };
      if (ordonanceData) {
       await axiosClient.put(`Ordonances/${ordonanceData.id}`, ordonanceFormData);
      } else {
        await axiosClient.post('Ordonances', ordonanceFormData);
      }

      fetchOrdonances();
       handleClose();
    } catch (error) {
      console.error('Error saving ordonance:', error);
    }
  };

  const handleClose = () => {
    setDate('');
    setDescription('');
    onClose();
  };

  return (
    <div className="container px-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Ajouter une ordonnance</h1>
      </div>
      <div className="bg-white shadow-lg overflow-auto w-full sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
                <label htmlFor="dateInput" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <Input
                  clearable
                  bordered
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                  id="dateInput"
                />
              </div>
            <div className="sm:col-span-6">
              <Textarea clearable bordered label="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-32" />
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <Button auto onClick={handleSubmit}>Enregistrer</Button>
            <Button auto flat color="error" onClick={handleClose}>Annuler</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjouteOrdonance;
