<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bilan extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'description',
    ];

    public function patients()
    {
        return $this->belongsToMany(Patient::class, 'patient_bilan')->withPivot('date');
    }
}
