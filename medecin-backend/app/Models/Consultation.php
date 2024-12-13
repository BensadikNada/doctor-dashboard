<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Consultation extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'consultation_date',
        'start_time',
        'end_time',
        'diagnosis',
        'prescription',
        'notes',
        'consultation_fee',
        'follow_up_needed',
        'follow_up_date',
        'body_temperature',
        'body_weight_kg',
        'blood_pressure',
        'blood_sugar',
        'symptoms',
        'medical_history',
        'allergies',
        'lab_tests',
        'family_medical_history',
    ];

    // Define the relationship with the Patient model
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
