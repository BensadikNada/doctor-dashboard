import React, { useState, useEffect } from 'react';
import axiosClient from '@/hooks/axiosClient';
import excellogo from "@/assets/Excel-logo.png"
import Csvlogo from "@/assets/csv.png"
import wordlogo from "@/assets/word-1.svg"


export default function Folder() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [folders, setFolders] = useState([]);
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchFolders(selectedPatient);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      const response = await axiosClient.get('/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const filterFoldersByDate = () => {
    if (!startDate && !endDate) {
      return folders; // No filtering if no dates are selected
    }

    const start = startDate ? new Date(startDate) : new Date('1970-01-01');
    const end = endDate ? new Date(endDate) : new Date('2999-12-31');

    return folders.filter(folder => {
      const folderDate = new Date(folder.created_at);
      return folderDate >= start && folderDate <= end;
    });
  };

  const filteredFolders = filterFoldersByDate();


  const fetchFolders = async (patientId) => {
    try {
      const response = await axiosClient.get(`/patients/${patientId}/folders`);
      const sortedFolders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setFolders(sortedFolders);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !selectedPatient) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await axiosClient.post(`/patients/${selectedPatient}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileUrl = uploadResponse.data;
      const folderData = {
        name: file.name,
        url: fileUrl,
      };
      await axiosClient.post(`/patients/${selectedPatient}/folders`, folderData);
      fetchFolders(selectedPatient);
      setFile(null)
    } catch (error) {
      console.error('Error handling the file upload and folder creation:', error);
    }
  };


  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'xlsx':
      case 'xls':
        return <img src={excellogo} className="w-full h-full" />;
      case 'csv':
        return <img src={Csvlogo} className="w-full h-full" />;
      case 'doc':
      case 'docx':
        return <img src={wordlogo} className="w-full h-full" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        // Assuming you meant to use a different logo for image files, but since it's not provided, using a placeholder
        // If you have an image logo, replace `excelLogo` with that
        return <img src={excellogo} className="w-full h-full" />;
      default:
        return '📦'; // Generic file icon
    }
  };


  const deleteFolder = async (folderId) => {
    try {
      await axiosClient.delete(`/patients/${selectedPatient}/folders/${folderId}`);
      setFolders(folders.filter(folder => folder.id !== folderId)); // Update UI
    } catch (error) {
      console.error('Error deleting the folder:', error);
    }
  };





  return (
    <div className="flex flex-col md:flex-row p-4 gap-4">
      <div className="flex flex-col gap-4 w-full md:w-1/3">
        <div className="bg-white text-black shadow rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-2">Select a Patient</h2>
          <select
            className="form-select mt-1 block w-full rounded-md text-white border-gray-300 p-3 shadow-sm"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
          >
            <option value="">Select a Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.nom} {patient.prenom}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-semibold text-black text-lg mb-2">Upload a File</h2>
          <input type="file" onChange={handleFileChange} className="mb-2 text-black" />
          <button
            onClick={handleUpload}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Upload File
          </button>
        </div>
      </div>
      <div className="w-full md:w-2/3">
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <h2 className="font-semibold text-black text-lg mb-2">Search Files by Date</h2>
          <div className="flex gap-4 mb-2">
            <input
              type="date"
              className="form-input p-4 mt-1 block w-full"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="form-input p-4 mt-1 block w-full"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            onClick={() => setFolders(filterFoldersByDate())} // Consider fetching fresh folders if needed
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4 bg-white">
          {filteredFolders.map((folder) => (
            <div key={folder.id} className="bg-black shadow rounded-lg p-4 flex flex-col">
              <div className="flex-grow">
                <h3 className="font-semibold text-white">{folder.name}</h3>
                {
                  ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(folder.name.split('.').pop().toLowerCase()) ? (
                    <img src={folder.url} alt={folder.name} className="max-w-full max-h-40 w-auto h-auto object-cover object-center rounded" />
                  ) : (
                    <div className="text-2xl w-full h-full flex items-center justify-center">{getFileTypeIcon(folder.name)}</div>
                  )
                }
              </div>
              <div className="flex justify-between items-center mt-2">
                <a
                  href={folder.url}
                  className="text-white bg-green-500 hover:bg-green-700 rounded px-3 py-1"
                >
                  Download
                </a>
                <button
                  onClick={() => deleteFolder(folder.id)}
                  className="text-white bg-red-500 hover:bg-red-700 rounded px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
