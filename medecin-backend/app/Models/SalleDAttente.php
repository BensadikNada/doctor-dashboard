<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalleDAttente extends Model
{
    use HasFactory;

    protected $table = 'salles_d_attente';

    protected $fillable = [
        'nom', 'capacite', 'disponibilite'
    ];

    public function patients()
    {
        return $this->belongsToMany(Patient::class, 'patient_salle_d_attente');
    }

}
