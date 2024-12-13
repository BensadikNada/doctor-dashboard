import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from '@material-tailwind/react';
import axiosClient from '@/hooks/axiosClient';

export function PatientSalleDAttenteDialog({ isOpen, onClose, patient, fetchPatients }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('');

  const handleSave = async () => {
    if (patient) {
      try {
        const data = {
          salle_d_attente_id: 1,
          date: date,
          heure: time,
        };
        await axiosClient.post(`assign_patient_to_salle/${patient.id}`, data);
        fetchPatients(); 
        onClose(); 
      } catch (error) {
        console.error('Error assigning patient to SalleDAttente:', error);
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader>Ajouter Patient dans Salle D'attente</DialogHeader>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <div>
            <strong>Patient Name:</strong> {patient?.nom} {patient?.prenom}
          </div>
          <Input
            type="date"
            label="Select Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="time"
            label="Select Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose}>Cancel</Button>
        <Button variant="filled" color="green" onClick={handleSave}>Save</Button>
      </DialogFooter>
    </Dialog>
  );
}
