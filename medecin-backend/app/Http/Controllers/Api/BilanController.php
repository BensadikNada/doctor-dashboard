<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Bilan;
use App\Models\Patient;
use Illuminate\Http\Response;

class BilanController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'description' => 'required|string',
        ]);

        $bilan = Bilan::create($validatedData);

        return response()->json($bilan, 201);
    }
    public function index()
    {
        $bilan= Bilan::all();
        return response()->json($bilan, 201);
    }

    public function linkToPatient(Request $request)
    {
        $validatedData = $request->validate([
            'patientId' => 'required|exists:patients,id',
            'bilanId' => 'required|exists:bilans,id',
            'date' => 'required|date',
        ]);

        $patient = Patient::findOrFail($validatedData['patientId']);
        $bilan = Bilan::findOrFail($validatedData['bilanId']);

        try {
            $patient->bilans()->attach($validatedData['bilanId'], ['date' => $validatedData['date']]);

            return response()->json([
                'message' => 'Bilan linked successfully to patient',
                'bilan' => $bilan,
                'patient' => $patient
            ], 200);
        } catch (QueryException $e) {
            if($e->getCode() == 23000) { // Check if the error code is for a duplicate entry
                return response()->json([
                    'message' => 'This bilan already exists for the patient on the selected date.'
                ], Response::HTTP_CONFLICT);
            }
            return response()->json([
                'message' => 'An unexpected error occurred.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    public function getBilanByPatientAndDate($patientId, $date)
    {
        $records = DB::table('patient_bilan')
                    ->join('bilans', 'patient_bilan.bilan_id', '=', 'bilans.id')
                    ->join('patients', 'patient_bilan.patient_id', '=', 'patients.id')
                    ->where('patient_bilan.patient_id', $patientId)
                    ->where('patient_bilan.date', $date)
                    ->get();

        $result = $records->map(function ($record) {
            return [
                'id' => $record->bilan_id,
                'patient' => [
                    'id' => $record->patient_id,
                    'nom' => $record->nom,
                    'image' => $record->image,
                    'prenom' => $record->prenom,
                ],
                'date' => $record->date,
                'bilan' => [
                    'id' => $record->id,
                    'description' => $record->description,
                ]
            ];
        });

        return response()->json($result, 201);
    }
    public function unlinkBilan(Patient $patient, Bilan $bilan)
    {
        try {
            $patientc = Patient::find($patient->id);

            $patientc->bilans()->detach($bilan->id);

            return response()->json([
                'message' => 'Bilan successfully unlinked from patient',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to unlink bilan from patient',
                'details' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


}
