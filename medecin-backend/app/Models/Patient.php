<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom', 'prenom', 'telephone', 'CIN', 'age', 'sexe', 'sanguim','image',
        'situation_familiale', 'adresse', 'dateArrive', 'heure', 'etat_maladie', 'etat_patient'
    ];
    public function sallesDAttente()
    {
        return $this->belongsToMany(SalleDAttente::class, 'patient_salle_d_attente');
    }

    public function consultations()
    {
        return $this->hasMany(Consultation::class);
    }

    public function Reservation()
    {
        return $this->hasMany(Reservation::class);
    }

    public function bilans()
    {
        return $this->belongsToMany(Bilan::class, 'patient_bilan', 'patient_id', 'bilan_id')->withTimestamps();
    }
    public function radios()
    {
        return $this->belongsToMany(Radio::class, 'patient_radio', 'patient_id', 'radio_id')->withTimestamps();
    }
    public function folders()
    {
        return $this->hasMany(Folder::class);
    }
}


