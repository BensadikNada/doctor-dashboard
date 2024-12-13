import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'; // Make sure Input is imported
import axiosClient from '@/hooks/axiosClient';

const Ordonance = ({ isOpen, onClose, ordonance, fetchOrdonances }) => {
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (ordonance) {
            setDate(ordonance.date);
            setDescription(ordonance.description);
        }
    }, [ordonance]);

    const handleSubmit = async () => {
        try {
            const ordonanceData = {
                date: date,
                description: description,
            };
            if (ordonance) {
                await axiosClient.put(`Ordonances/${ordonance.id}`, ordonanceData);
            } else {
                await axiosClient.post('Ordonances', ordonanceData);
            }

            fetchOrdonances();
            onClose();
        } catch (error) {
            console.error('Error saving ordonance:', error);
        }
    };

    return (
        <Modal size='4xl' isOpen={isOpen} onClose={onClose} className="bg-white rounded-lg shadow-xl overflow-hidden">
            <ModalContent>
                <ModalHeader className="bg-gray-100 px-4 py-2 text-lg leading-6 font-medium text-gray-900"> {ordonance ? 'Modifier Ordonance' : 'Ajouter Ordonance'} </ModalHeader>
                <ModalBody className="px-4 py-5 bg-white space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                            <Input clearable bordered type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div className="sm:col-span-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <Input clearable bordered type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
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

export default Ordonance;
