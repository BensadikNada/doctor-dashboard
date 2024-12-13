import React, { useState, useEffect } from 'react';
import axiosClient from '@/hooks/axiosClient';
import { format, addDays, subDays, isValid } from 'date-fns';
import Select from 'react-select';
import { Button } from '@material-tailwind/react';
import {
  TrashIcon,
} from "@heroicons/react/24/solid";

export const Radio = ({ patient }) => {
  const [Radiospatient, setRadiospatient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datesList, setDatesList] = useState([]);
  const [radio, setradio] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [radioDescription, setRadioDescription] = useState('');
  const formattedDate = isValid(selectedDate) ? format(selectedDate, 'yyyy-MM-dd') : '';

  useEffect(() => {
    fetchOptions();
    generateDateList(selectedDate);
  }, []);

  const fetchOptions = async () => {
    try {
      const response = await axiosClient.get('radios');
      const fetchedOptions = response.data.map(item => ({
        value: item.id,
        label: item.description
      }));
      setradio(fetchedOptions);
    } catch (error) {
      console.error('Failed to fetch options:', error);
    }
  };

  useEffect(() => {
    fetchRadios(selectedDate);
  }, [selectedDate]);

  const generateDateList = (date) => {
    let tempList = [];
    for (let i = -3; i <= 3; i++) {
      tempList.push(addDays(date, i));
    }
    setDatesList(tempList);
  };

  const fetchRadios = async (date) => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await axiosClient.get(`patients/${patient.id}/radios/date/${formattedDate}`);
      setRadiospatient(response.data);
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

  const handleSelectRadio = (selectedOption) => {
    setSelectedRadio(selectedOption);
  };


  const SubmitPatient = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patientId: patient.id,
        radioId: selectedRadio.value,
        date: format(selectedDate, 'yyyy-MM-dd'),
      };
      const response = await axiosClient.post('link-radio-to-patient', payload);
      if (response.status === 200) {
        alert('Radiologie liée avec succès au patient');
        setSelectedRadio()
        setSelectedDate(new Date())
        fetchRadios(new Date());
        
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Cette radiologie existe déjà pour le patient à la date sélectionnée.");
      } else {
        console.error('Failed to link radio to patient:', error);
        alert('Bilan already exist.');
      }
    }
  };



  const handleDescriptionChange = (e) => {
    setRadioDescription(e.target.value);
  };

  const handleSubmitRadio = async (e) => {
    e.preventDefault();
    const radioData = {
      description: radioDescription,
    };
    try {
      await axiosClient.post('/radios', radioData);
      fetchOptions()
      alert('Radiologie créée avec succès');
      setRadioDescription('');
    } catch (error) {
      console.error('Failed to create radio:', error);
    }
  };

  const handleDeleteRadio = async (radioId) => {
    try {
      const response = await axiosClient.delete(`patients/${patient.id}/radios/${radioId}`);
      fetchRadios(new Date()); 
      alert('Radiologie supprimée avec succès');
    } catch (error) {
      console.error('Failed to delete radio:', error);
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
        <h2 className='text-lg text-white font-semibold w-full'>Sélectionner une date</h2>
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
        <h2 className='text-lg font-semibold w-full text-center'>Liste de radiologies pour la date sélectionnée</h2>
        <ul>
          {loading ? (
            <div className="">Chargement en cours...</div>
          ):(
            <>
            {Radiospatient.map((radio, index) =>
              <li key={index} className="flex justify-between text-lg text-black font-bold items-center">
                - {radio?.radio.description}
              <span className="material-icons cursor-pointer mr-8" onClick={() => handleDeleteRadio(radio?.id)}>
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
          <h2 className='text-lg rounded-xl font-semibold w-full text-center'>Ajouter une radiologie pour le patient</h2>
          <div className="w-full rounded-lg flex items-center justify-center">
            <Select
              options={radio}
              onChange={handleSelectRadio}
              className="w-full rounded-lg"
              placeholder="Recherche..."
              isSearchable={true}
            />
          </div>
          <Button type='submit'>Ajouter</Button>
        </form>

        <div className='flex-1 border-black rounded-xl border-[2px] p-4 flex flex-col '>
          <form onSubmit={handleSubmitRadio} className="flex-1 w-full flex flex-col justify-between items-center">
          <h2 className='text-lg font-semibold w-full text-center'>Créer une radiologie</h2>
            <input
              type="text"
              value={radioDescription}
              onChange={handleDescriptionChange}
              className="p-2 border-2 w-full border-gray-300 rounded-md"
              placeholder="Description"
            />
            <Button type="submit" className="p-2 text-white rounded-lg">
            Ajouter une radiologie            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Radio;
