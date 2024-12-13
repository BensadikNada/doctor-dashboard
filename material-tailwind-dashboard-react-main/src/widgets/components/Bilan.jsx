import React, { useState, useEffect } from 'react';
import axiosClient from '@/hooks/axiosClient';
import { format, addDays, subDays, isValid } from 'date-fns';
import Select from 'react-select';
import { Button } from '@material-tailwind/react';
import {
  TrashIcon,
} from "@heroicons/react/24/solid";

export const Bilan = ({ patient }) => {
  const [Bilanspatient, setBilanspatient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datesList, setDatesList] = useState([]);
  const [bilan, setbilan] = useState([]);
  const [selectedBilan, setSelectedBilan] = useState(null);
  const [bilanDescription, setBilanDescription] = useState('');
  const formattedDate = isValid(selectedDate) ? format(selectedDate, 'yyyy-MM-dd') : '';

  useEffect(() => {
    fetchOptions();
    generateDateList(selectedDate);
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axiosClient.get('bilans');
      const fetchedOptions = response.data.map(item => ({
        value: item.id,
        label: item.description
      }));
      setbilan(fetchedOptions);
    } catch (error) {
      console.error('Failed to fetch options:', error);
    }
  };

  useEffect(() => {
    fetchBilans(selectedDate);
  }, [selectedDate]);

  const generateDateList = (date) => {
    let tempList = [];
    for (let i = -3; i <= 3; i++) {
      tempList.push(addDays(date, i));
    }
    setDatesList(tempList);
  };

  const fetchBilans = async (date) => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await axiosClient.get(`patients/${patient.id}/bilans/date/${formattedDate}`);
      setBilanspatient(response.data);
      console.log(response)
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleDateChange = (event) => {
   const newDate = new Date(event.target.value);
      if (isValid(newDate)) {
        setSelectedDate(newDate);
      } else {
        console.error('Invalid date selected');
      }
  }
  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  //if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleSelectBilan = (selectedOption) => {
    setSelectedBilan(selectedOption);
  };


  const SubmitPatient = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patientId: patient.id,
        bilanId: selectedBilan.value,
        date: format(selectedDate, 'yyyy-MM-dd'),
      };
      const response = await axiosClient.post('link-bilan-to-patient', payload);
      if (response.status === 200) {
        alert('Le bilan a été lié avec succès au patient.');
        setSelectedBilan()
        setSelectedDate(new Date())
        fetchBilans(new Date());
        
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('Ce bilan existe déjà pour le patient à la date sélectionnée.');
      } else {
        console.error('Failed to link bilan to patient:', error);
        alert('Bilan already exist.');
      }
    }
  };



  const handleDescriptionChange = (e) => {
    setBilanDescription(e.target.value);
  };

  const handleSubmitBilan = async (e) => {
    e.preventDefault();
    const bilanData = {
      description: bilanDescription,
    };
    try {
      await axiosClient.post('/bilans', bilanData);
      fetchOptions()
      alert('Le bilan a été créé avec succès.');
      setBilanDescription('');
    } catch (error) {
      console.error('Failed to create bilan:', error);
    }
  };

  const handleDeleteBilan = async (bilanId) => {
    try {
      const response = await axiosClient.delete(`patients/${patient.id}/bilans/${bilanId}`);
      fetchBilans(new Date()); 
      alert('Le bilan a été supprimé avec succès.');
    } catch (error) {
      console.error('Failed to delete bilan:', error);
    }
  };

  const icon = {
    className: "w-5 h-5 text-inherit text-red-800",
  };

  return (
    <div className='w-full flex flex-row gap-2 '>
      <div className='flex flex-col p-2 bg-black rounded-2xl overflow-auto'>
        <div className="p-4">
          <input className='p-1 rounded-lg text-white bg-black' type='date' value={format(selectedDate, 'yyyy-MM-dd')} onChange={handleDateChange} />
        </div>
        <h2 className='text-lg text-white font-semibold w-full'>Select a Date</h2>
        <div>
          {datesList.map((date, index) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
            const isSelected = dateStr === selectedDateStr;
            return (
              <div
                key={index}
                className={`cursor-pointer p-2 m-1 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'text-white'}`}
                onClick={() => handleSelectDate(date)}
              >
                {format(date, 'PPP')}
              </div>
            );
          })}
        </div>
      </div>
      <div className='flex-1 border-[2px] pt-5 border-black rounded-lg flex flex-col pl-10 bg-white gap-8  overflow-auto'>
        <h2 className='text-lg font-semibold w-full text-center'>Liste des bilans pour la date sélectionnée</h2>
        <ul>
          {loading ? (
            <div className=''>Chargement en cours...</div>
          ):(
            <>
            {Bilanspatient.map((bilan, index) =>
              <li key={index} className="flex justify-between text-lg text-black font-bold items-center">
                - {bilan?.bilan.description}
              <span className="material-icons cursor-pointer mr-8" onClick={() => handleDeleteBilan(bilan?.id)}>
                <TrashIcon {...icon} />
              </span>
            </li>
            )}
            </>
          )}
         
        </ul>
      </div>
      <div className='flex-1  flex flex-col gap-2'>
        <form onSubmit={SubmitPatient} className='flex-1 flex flex-col p-4 justify-between items-center border-black rounded-xl border-[2px]'>
          <h2 className='text-lg rounded-xl font-semibold w-full text-center'>Ajouter un bilan pour le patient</h2>
          <div className="w-full rounded-lg flex items-center justify-center">
            <Select
              options={bilan}
              onChange={handleSelectBilan}
              className="w-full rounded-lg"
              placeholder="Recherche..."
              isSearchable={true}
            />
          </div>
          <Button type='submit'>Ajouter</Button>
        </form>

        <div className='flex-1 border-black rounded-xl border-[2px] p-4 flex flex-col '>
          <form onSubmit={handleSubmitBilan} className="flex-1 w-full flex flex-col justify-between items-center">
          <h2 className='text-lg font-semibold w-full text-center'>Créer un bilan</h2>
            <input
              type="text"
              value={bilanDescription}
              onChange={handleDescriptionChange}
              className="p-2 border-2 w-full border-gray-300 rounded-md"
              placeholder="Description"
            />
            <Button type="submit" className="p-2 text-white rounded-lg">
            Ajouter un bilan
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Bilan;
