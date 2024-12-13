<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Patient;
use App\Models\SalleDAttente;

class SalleDAttenteController extends Controller
{
    public function addPatient(Request $request, $patientId)
    {
        $salleId = $request->input('salle_d_attente_id');
        $date = $request->input('date');
        $heure = $request->input('heure');
        $salle = SalleDAttente::findOrFail($salleId);
        $patient = Patient::findOrFail($patientId);
        $salle->patients()->attach($patientId, ['date' => $date, 'heure' => $heure]);
        return response()->json(['message' => 'Patient added to Salle D\'Attente successfully']);
    }


    public function removePatient($salleId, $patientId)
    {
        $salle = SalleDAttente::findOrFail($salleId);
        $patient = Patient::findOrFail($patientId);
        $today = now()->toDateString();
        $salle->patients()->newPivotStatementForId($patientId)
              ->where('date', $today)
              ->delete();
        return response()->json(['message' => 'Patient removed from Salle D\'Attente for today successfully']);
    }



    public function getAllPatientsInSalles()
{
    $today = now()->toDateString();
    $salles = SalleDAttente::with(['patients' => function ($query) use ($today) {
        // Include pivot data in the relationship
        $query->wherePivot('date', $today)->withPivot('heure');
    }])->get();

    $patients = $salles->flatMap(function ($salle) {
        return $salle->patients->map(function ($patient) use ($salle) {
            // Include salle_d_attente_id and heure from pivot in the patient data
            return array_merge($patient->toArray(), [
                'heure' => $patient->pivot->heure, 
            ]);
        });
    });

    return response()->json($patients);
}




}
