<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('patient_salle_d_attente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->nullable()->constrained('patients')->onDelete('set null'); // Assurez-vous que 'patients' est le nom correct de la table
            $table->foreignId('salle_d_attente_id')->nullable()->constrained('salles_d_attente')->onDelete('set null'); // Assurez-vous que 'salles_d_attente' est le nom correct de la table
            $table->date('date')->nullable();
            $table->time('heure')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_salle_d_attente');
    }
};
