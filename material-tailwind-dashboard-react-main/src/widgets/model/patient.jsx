import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'; // Make sure Select is imported
import axiosClient from '@/hooks/axiosClient';

const PatientModal = ({ isOpen, onClose, patient, fetchPatients }) => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [CIN, setCIN] = useState('');
    const [age, setAge] = useState('');
    const [sexe, setSexe] = useState('');
    const [sanguim, setSanguim] = useState('');
    const [situationFamiliale, setSituationFamiliale] = useState('');
    const [adresse, setAdresse] = useState('');
    const [dateArrive, setDateArrive] = useState('');
    const [heure, setHeure] = useState('');
    const [etatMaladie, setEtatMaladie] = useState('');
    const [etatPatient, setEtatPatient] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    useEffect(() => {
        if (patient) {
            setNom(patient?.nom);
            setPrenom(patient?.prenom);
            setTelephone(patient?.telephone);
            setCIN(patient?.CIN);
            setAge(patient?.age);
            setSexe(patient?.sexe);
            setSanguim(patient?.sanguim);
            setSituationFamiliale(patient?.situation_familiale);
            setAdresse(patient?.adresse);
            setDateArrive(patient?.dateArrive);
            setHeure(patient?.heure);
            setEtatMaladie(patient?.etat_maladie);
            setEtatPatient(patient?.etat_patient);
            setImagePreviewUrl(patient?.image); // Assuming patient.image is the URL of the image
        }
    }, [patient]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreviewUrl(null);
        }
    };

    const handleSubmit = async () => {
        try {
            let imageUrl = patient?.image;
            if (image) {
                const formData = new FormData();
                formData.append('file', image);
                const response = await axiosClient.post('image', formData);
                imageUrl = response.data;
            }
            const patientData = {
                nom,
                prenom,
                telephone,
                CIN,
                age,
                sexe,
                sanguim,
                situation_familiale: situationFamiliale,
                adresse,
                dateArrive,
                heure,
                etat_maladie: etatMaladie,
                etat_patient: etatPatient,
                image: imageUrl,
            };

            if (patient) {
                // Update existing patient
                await axiosClient.put(`patients/${patient.id}`, patientData);
            } else {
                // Create new patient
                await axiosClient.post('patients', patientData);
            }

            fetchPatients(); 
            handleClose();
        } catch (error) {
            console.error('Error saving patient:', error);
        }
    };

    const handleClose = () => {
        setNom('');
        setPrenom('');
        setTelephone('');
        setCIN('');
        setAge('');
        setSexe('');
        setSanguim('');
        setSituationFamiliale('');
        setAdresse('');
        setDateArrive('');
        setHeure('');
        setEtatMaladie('');
        setEtatPatient('');
        setImage(null);
        setImagePreviewUrl(null);
        onClose();
    };

    
    return (
        <Modal size='4xl' isOpen={isOpen} onClose={onClose} className="bg-white  rounded-lg shadow-xl overflow-hidden">
            <ModalContent>
                <ModalHeader className="bg-gray-100 px-4 py-2 text-lg leading-6 font-medium text-gray-900"> {patient ? 'Modifier Patient' : 'Ajouter Patient'} </ModalHeader>
                <ModalBody className="px-4 py-5 bg-white space-y-6">
                    {imagePreviewUrl && (
                        <img src={imagePreviewUrl} alt="Selected Image" className="mx-auto h-28 w-28 rounded-full" />
                    )}
                   <div className="sm:col-span-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <Input clearable bordered label="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                        </div>
                        <div className="sm:col-span-3">
                            <Input clearable bordered label="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                        </div>
                        <div className="sm:col-span-4">
                            <Input clearable bordered label="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <Input clearable bordered label="CIN" value={CIN} onChange={(e) => setCIN(e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <Input clearable bordered label="Âge" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="sexeSelect" className="block text-sm font-medium text-gray-700">Sexe</label>
                            <select
                                id="sexeSelect"
                                value={sexe}
                                onChange={(e) => setSexe(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="sm:col-span-3">
                            <Input   label="Groupe Sanguin" value={sanguim} onChange={(e) => setSanguim(e.target.value)} />
                        </div>
                        <div className="sm:col-span-3">
                            <Input   label="Situation Familiale" value={situationFamiliale} onChange={(e) => setSituationFamiliale(e.target.value)} />
                        </div>
                        <div className="sm:col-span-6">
                            <Input clearable bordered label="Adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="Date d'Arrivée" className="block text-sm font-medium text-gray-700">Date d'Arrivée</label>
                            <Input clearable bordered type="date"  value={dateArrive} onChange={(e) => setDateArrive(e.target.value)} />
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="Heure" className="block text-sm font-medium text-gray-700">Heure</label>
                            <Input clearable bordered type="time" value={heure} onChange={(e) => setHeure(e.target.value)} />
                        </div>
                        
                        <div className="sm:col-span-3">
                            <Input clearable bordered label="État de la Maladie" value={etatMaladie} onChange={(e) => setEtatMaladie(e.target.value)} />
                        </div>
                        <div className="sm:col-span-3">
                            <Input clearable bordered label="État du Patient" value={etatPatient} onChange={(e) => setEtatPatient(e.target.value)} />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex  justify-start items-center sm:flex-row-reverse">
                    <Button auto  onClick={handleSubmit}>Save</Button>
                    <Button auto flat color="error" onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
    
};

export default PatientModal;
