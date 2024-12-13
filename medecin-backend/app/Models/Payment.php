<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'consultation_id',
        'amount_paid',
    ];

    // Define the relationship with the Consultation model
    public function consultation()
    {
        return $this->belongsTo(Consultation::class);
    }
}
