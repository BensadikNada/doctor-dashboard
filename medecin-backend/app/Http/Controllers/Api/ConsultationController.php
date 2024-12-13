<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function index()
    {
        return Consultation::with('patient')->get();
    }

    public function store(Request $request)
    {
        $consultation = Consultation::create($request->all());

        return response()->json($consultation, 201);
    }

    public function show(Consultation $consultation)
    {
        return $consultation;
    }

    public function update(Request $request, Consultation $consultation)
    {
        $consultation->update($request->all());
        return response()->json($consultation, 200);
    }

    public function destroy(Consultation $consultation)
    {
        $consultation->delete();
        return response()->json(null, 204);
    }
}
