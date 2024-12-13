import React, { useState, useEffect } from 'react';
import axiosClient from '@/hooks/axiosClient';
import { Input, Textarea, Button } from '@nextui-org/react';

const AjouteConsultation = ({ onClose, consultation, fetchConsultations, patientId }) => {
    const [consultationDate, setConsultationDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState('');
    const [notes, setNotes] = useState('');
    const [consultationFee, setConsultationFee] = useState('');
    const [followUpNeeded, setFollowUpNeeded] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [bodyTemperature, setBodyTemperature] = useState('');
    const [bodyWeightKg, setBodyWeightKg] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [bloodSugar, setBloodSugar] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [allergies, setAllergies] = useState('');
    const [labTests, setLabTests] = useState('');
    const [familyMedicalHistory, setFamilyMedicalHistory] = useState('');

    useEffect(() => {
        if (consultation) {
            setConsultationDate(consultation.consultation_date);
            setStartTime(consultation.start_time);
            setEndTime(consultation.end_time);
            setDiagnosis(consultation.diagnosis);
            setPrescription(consultation.prescription);
            setNotes(consultation.notes);
            setConsultationFee(consultation.consultation_fee);
            setFollowUpNeeded(consultation.follow_up_needed);
            setFollowUpDate(consultation.follow_up_date);
            // Set values for new fields if consultation exists
            setBodyTemperature(consultation.body_temperature || '');
            setBodyWeightKg(consultation.body_weight_kg || '');
            setBloodPressure(consultation.blood_pressure || '');
            setBloodSugar(consultation.blood_sugar || '');
            setSymptoms(consultation.symptoms || '');
            setMedicalHistory(consultation.medical_history || '');
            setAllergies(consultation.allergies || '');
            setLabTests(consultation.lab_tests || '');
            setFamilyMedicalHistory(consultation.family_medical_history || '');
        } else {
            // Handle the case when creating a new consultation
        }
    }, [consultation, patientId]);

    const handleSubmit = async () => {
        try {
            const consultationData = {
                patient_id: patientId.id,
                consultation_date: consultationDate,
                start_time: startTime,
                end_time: endTime,
                diagnosis: diagnosis,
                prescription: prescription,
                notes: notes,
                consultation_fee: consultationFee,
                follow_up_needed: followUpNeeded,
                follow_up_date: followUpDate,
                // Include new fields in consultation data
                body_temperature: bodyTemperature,
                body_weight_kg: bodyWeightKg,
                blood_pressure: bloodPressure,
                blood_sugar: bloodSugar,
                symptoms: symptoms,
                medical_history: medicalHistory,
                allergies: allergies,
                lab_tests: labTests,
                family_medical_history: familyMedicalHistory,
            };

            if (consultation) {
                // Update existing consultation
                await axiosClient.put(`consultations/${consultation.id}`, consultationData);
            } else {
                // Create new consultation
                await axiosClient.post('consultations', consultationData);
            }

            fetchConsultations();
            handleClose();
        } catch (error) {
            console.error('Error saving consultation:', error);
        }
    };

    const handleClose = () => {
        // Reset all fields on close
        setConsultationDate('');
        setStartTime('');
        setEndTime('');
        setDiagnosis('');
        setPrescription('');
        setNotes('');
        setConsultationFee('');
        setFollowUpNeeded('');
        setFollowUpDate('');
        // Reset new fields
        setBodyTemperature('');
        setBodyWeightKg('');
        setBloodPressure('');
        setBloodSugar('');
        setSymptoms('');
        setMedicalHistory('');
        setAllergies('');
        setLabTests('');
        setFamilyMedicalHistory('');
        onClose();
    };

    return (
        <div className=" px-4">
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-gray-900">{consultation ? 'Modifier Consultation' : 'Ajouter Consultation'}</h1>
            </div>
            <div className="bg-white shado-2xl overflow-auto w-full sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6 flex lg:flex-row flex-col gap-3">
                    <div className="flex-1">
                        <div>
                            <label className="w-full sm:w-1/2 mb-4" htmlFor="">Date de consultation</label>
                            <Input clearable bordered label="" type="date" value={consultationDate} onChange={(e) => setConsultationDate(e.target.value)} className="w-full mb-4" />
                        </div>

                        <Input clearable bordered label="Heure de début" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full  mb-4" />
                        <Input clearable bordered label="Ordonnance" value={prescription} onChange={(e) => setPrescription(e.target.value)} className="w-full mb-4" />
                        <Input clearable bordered label="Diagnostic" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="w-full mb-4" />
                        <Input clearable bordered label="Suivi nécessaire" value={followUpNeeded} onChange={(e) => setFollowUpNeeded(e.target.value)} className="w-full mb-4" />
                    </div>
                    <div className="flex-1">
                        <div>
                            <label className="w-full sm:w-1/2 mb-4" htmlFor="">Date de suivi</label>
                            <Input clearable bordered label="" type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="w-full  mb-4" />
                        </div>
                        <Input clearable bordered label="Heure de fin" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full  mb-4" />
                        <Input clearable bordered label="Frais de consultation" type="number" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} className="w-full mb-4" />
                        <Input clearable bordered label="Antécédents médicaux familiaux" value={familyMedicalHistory} onChange={(e) => setFamilyMedicalHistory(e.target.value)} className="w-full mb-4" />
                        <Input clearable bordered label="Tests de laboratoire" value={labTests} onChange={(e) => setLabTests(e.target.value)} className="w-full mb-4" />

                          </div>
                    <div className="flex-1">
                        <div>
                            <label className="w-full sm:w-1/2 mb-4" htmlFor="">Pression artérielle</label>
                            <Input clearable bordered  value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} className="w-full mb-4" />
                        </div>
                        <Input clearable bordered label="Température corporelle" value={bodyTemperature} onChange={(e) => setBodyTemperature(e.target.value)} className="w-full mb-4" />
                        <Input clearable bordered label="Sucre dans le sang" value={bloodSugar} onChange={(e) => setBloodSugar(e.target.value)} className="w-full mb-4" />
                        <Input clearable bordered label="Symptômes" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="w-full mb-4" />
                        <Input clearable bordered label="Poids corporel (kg)" value={bodyWeightKg} onChange={(e) => setBodyWeightKg(e.target.value)} className="w-full mb-4" />
                   </div>
                </div>
                <div className='flex flex-col lg:flex-row gap-3 p-4'>
                    <Textarea clearable bordered label="Antécédents médicaux" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} className="w-full h-32 " />
                    <Textarea clearable bordered label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full h-32 " />
                </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <Button auto onClick={handleSubmit}>Save</Button>
                    <Button auto flat color="error" onClick={handleClose}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default AjouteConsultation;
