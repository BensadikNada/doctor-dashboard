<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ordonance;
use Illuminate\Http\Request;

class OrdonanceController extends Controller
{
    public function index(Request $request)
    {
        $idpatient=$request->input('patient_id');
        return Ordonance::with('patient')->where("patient_id",$idpatient)->get();
    }

    public function store(Request $request)
    {
        // Add validation logic here if needed
        $ordonance = Ordonance::create($request->all());
        return response()->json($ordonance, 201);
    }

    public function show(Ordonance $ordonance)
    {
        return $ordonance;
    }

    public function update(Request $request,$id )
    {
        // Add validation logic here if needed
        $ordonance = Ordonance::findOrFail($id);
        $ordonance->update($request->all());
        return response()->json($ordonance, 200);
    }

    public function destroy($id)
    {
        $ordonance = Ordonance::findOrFail($id);
        $ordonance->delete();
        return response()->json(null, 204);
    }

}
