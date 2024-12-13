import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select } from '@nextui-org/react'; // Make sure Select is imported
import axiosClient from '@/hooks/axiosClient';

const ReservationModal = ({ isOpen, onClose, reservation, fetchReservations }) => {
    const [reservationDate, setReservationDate] = useState('');
    const [heure, setHeure] = useState('');
    const [to_heure, setto_heure] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

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
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (reservation) {
            setReservationDate(reservation?.reservation_date);
            setSelectedPatient(reservation?.patient_id);
            setHeure(reservation?.heure); // Set the heure value if reservation is provided
        }
    }, [reservation]);

    const handleSubmit = async () => {
        try {
            const reservationData = {
                reservation_date: reservationDate,
                patient_id: selectedPatient,
                heure: heure, 
                to_heure:to_heure,
            };
            if (reservation) {
                await axiosClient.put(`reservations/${reservation.id}`, reservationData);
            } else {
                await axiosClient.post('reservations', reservationData);
            }

            fetchReservations();
            onClose();
        } catch (error) {
            console.error('Error saving reservation:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Modal size='4xl' isOpen={isOpen} onClose={onClose} className="bg-white rounded-lg shadow-xl overflow-hidden">
            <ModalContent>
                <ModalHeader className="bg-gray-100 px-4 py-2 text-lg leading-6 font-medium text-gray-900"> {reservation ? 'Modifier Reservation' : 'Ajouter Reservation'} </ModalHeader>
                <ModalBody className="px-4 py-5 bg-white space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-700">Date de réservation</label>
                            <Input clearable bordered type="date" id="reservationDate" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="heure" className="block text-sm font-medium text-gray-700">Heure de réservation</label>
                            <Input clearable bordered type="time" id="heure" value={heure} onChange={(e) => setHeure(e.target.value)} />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="to_heure" className="block text-sm font-medium text-gray-700">Heure de fin réservation</label>
                            <Input clearable bordered type="time" id="to_heure" value={to_heure} onChange={(e) => setto_heure(e.target.value)} />
                        </div>
                        
                        <div className="sm:col-span-3">
                            <label htmlFor="patientSelect" className="block text-sm font-medium text-gray-700">Patient</label>
                            <select 
                                id="patientSelect" 
                                value={selectedPatient} 
                                onChange={(event) => setSelectedPatient(event.target.value)} // Use event.target.value to get the selected value
                                placeholder="Select a patient"
                            >
                                <option value="">Select a patient</option>
                                {users.map((patient) => (
                                    <option key={patient.id} value={patient.id}>{`${patient.nom} ${patient.prenom}`}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex justify-start items-center sm:flex-row-reverse">
                    <Button auto onClick={handleSubmit}>Save</Button>
                    <Button auto flat color="error" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ReservationModal;