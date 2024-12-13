<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ordonance extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id', 'date', 'description'
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
