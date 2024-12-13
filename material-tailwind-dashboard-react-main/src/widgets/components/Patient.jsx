import React from 'react';

export default function Users({ patient }) {
  // Example data structure:
  // patient = {
  //   ...patient details,
  //   consultationsCount: 5,
  //   reservationsCount: 3,
  //   bilansCount: 2,
  //   radiosCount: 4,
  // }

  return (
    <div className="flex justify-center items-center bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col-reverse gap-3 justify-center items-center lg:flex-col ">
          
            <div className="lg:flex-shrink-0">
              <img className="rounded-full lg:w-48 h-48 w-full object-cover" src={patient?.image} alt={`${patient?.nom} ${patient?.prenom}`} />
            </div>
            <div className="  lg:w-48 h-48 bg-purple-50 p-4 rounded-lg mt-4 ">
              <h3 className="text-lg font-semibold text-purple-600">"Statistiques du patient</h3>
              <div className="mt-2">
                <p className="text-gray-800">Consultations: {patient?.consultations_count}</p>
                <p className="text-gray-800">Rendez-vous: {patient?.reservation_count}</p>
                <p className="text-gray-800">Bilans: {patient?.bilans_count}</p>
                <p className="text-gray-800">Radiologie: {patient?.radios_count}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-indigo-700">{patient?.nom} {patient?.prenom}</h2>
              <p className="mt-1 text-gray-600">Âge : {patient?.age} | Sexe : {patient?.sexe} | Groupe sanguin : {patient?.sanguim}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold text-indigo-600">Informations de contact</h3>
              <p className="text-gray-800">Téléphone : {patient?.telephone}</p>
              <p className="text-gray-800">CIN: {patient?.CIN}</p>
              <p className="text-gray-800">Adresse : {patient?.adresse}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold text-indigo-600">Informations de santé</h3>
<p className="text-gray-800">État civil : {patient?.situation_familiale}</p>
<p className="text-gray-800">Date d'arrivée : {patient?.dateArrive}</p>
<p className="text-gray-800">Heure d'arrivée : {patient?.heure}</p>
<p className="text-gray-800">État de la maladie : {patient?.etat_maladie}</p>
<p className="text-gray-800">État du patient : {patient?.etat_patient}</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
