<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Radio;
use App\Models\Patient;
use Illuminate\Http\Response;

class RadioController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'description' => 'required|string',
        ]);

        $radio = Radio::create($validatedData);

        return response()->json($radio, 201);
    }
    public function index()
    {
        $radio= Radio::all();
        return response()->json($radio, 201);
    }

    public function linkToPatient(Request $request)
    {
        $validatedData = $request->validate([
            'patientId' => 'required|exists:patients,id',
            'radioId' => 'required|exists:radios,id',
            'date' => 'required|date',
        ]);

        $patient = Patient::findOrFail($validatedData['patientId']);
        $radio = Radio::findOrFail($validatedData['radioId']);

        try {
            $patient->radios()->attach($validatedData['radioId'], ['date' => $validatedData['date']]);

            return response()->json([
                'message' => 'Radio linked successfully to patient',
                'radio' => $radio,
                'patient' => $patient
            ], 200);
        } catch (QueryException $e) {
            if($e->getCode() == 23000) { // Check if the error code is for a duplicate entry
                return response()->json([
                    'message' => 'This radio already exists for the patient on the selected date.'
                ], Response::HTTP_CONFLICT);
            }
            return response()->json([
                'message' => 'An unexpected error occurred.'
            ], Response::HTTP_INTERNAL_SERVER_ERROR); // 500 Internal Server Error
        }
    }

    public function getRadioByPatientAndDate($patientId, $date)
    {
        $records = DB::table('patient_radio')
                    ->join('radios', 'patient_radio.radio_id', '=', 'radios.id')
                    ->join('patients', 'patient_radio.patient_id', '=', 'patients.id')
                    ->where('patient_radio.patient_id', $patientId)
                    ->where('patient_radio.date', $date)
                    ->get();

        $result = $records->map(function ($record) {
            return [
                'id' => $record->radio_id,
                'patient' => [
                    'id' => $record->patient_id,
                    'nom' => $record->nom,
                    'image' => $record->image,
                    'prenom' => $record->prenom,
                ],
                'date' => $record->date,
                'radio' => [
                    'id' => $record->id,
                    'description' => $record->description,
                ]
            ];
        });

        return response()->json($result, 201);
    }
    public function unlinkRadio(Patient $patient, Radio $radio)
    {
        try {
            $patientc = Patient::find($patient->id);

            $patientc->radios()->detach($radio->id);

            return response()->json([
                'message' => 'Radio successfully unlinked from patient',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to unlink radio from patient',
                'details' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


}
