<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'url', 'patient_id' ,'date',"created_at"];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

}
