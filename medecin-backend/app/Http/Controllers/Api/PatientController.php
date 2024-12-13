<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Folder;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;


class PatientController extends Controller
{
    public function index()
    {
        $patients = Patient::withCount(['consultations', 'Reservation','bilans','radios'])->get();
        return $patients;
    }

    public function store(Request $request)
    {
        $patient = Patient::create($request->all());

        return response()->json($patient, 201);
    }

    public function show(Patient $patient)
    {
        return $patient;
    }

    public function update(Request $request, Patient $patient)
    {
        $patient->update($request->all());
        return response()->json($patient, 200);
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();
        return response()->json(null, 204);
    }

    public function Image(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Supplier invoice not found'], 404);
        }

        if ($request->hasFile('file')) {
            $image = $request->file('file');
            $imagePath = $image->store('public/patient/' );
            $profilePictureUrl = asset('storage/patient/'  . basename($imagePath));
            return response()->json( $profilePictureUrl, 200);
        }

        return response()->json(['message' => 'No image file provided'], 400);
    }
    public function files(Request $request, $patientId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($request->hasFile('file')) {
            $path = 'public/patient/' . $patientId . '/';
            $file = $request->file('file');
            $filePath = $file->store($path);
            $fileUrl = asset('storage/patient/' . $patientId . '/' . basename($filePath));

            return response()->json($fileUrl, 200);
        }

        return response()->json(['message' => 'No image file provided'], 400);
    }



    public function getFolders(Patient $patient)
    {
        $folders = $patient->folders;
        return response()->json($folders);
    }

    public function storeFolder(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|string|max:255',
        ]);
        $folder = $patient->folders()->create($validated);
        return response()->json($folder, 201);
    }
    
    public function downloadFile(Patient $patient, $folderId)
    {
        $folder = $patient->folders()->findOrFail($folderId);

        $filePath = $folder->url; // Ensure this path includes the patient ID as set during upload
        $fileName = basename($filePath);

        if (!Storage::exists($filePath)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return Storage::download($filePath, $fileName);
    }
    public function deleteFolder($patientId, $folderId)
    {
        // Find the patient by ID
        $patient = Patient::findOrFail($patientId);

        // Optionally, ensure that the folder belongs to the patient
        $folder = $patient->folders()->findOrFail($folderId);

        // If the folder has a file associated, delete it from storage
        if (Storage::exists($folder->url)) {
            Storage::delete($folder->url);
        }

        // Delete the folder record from the database
        $folder->delete();

        // Return a success response
        return response()->json(['message' => 'Folder deleted successfully.'], 200);
    }


}

