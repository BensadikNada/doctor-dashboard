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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom')->nullable();
            $table->string('telephone')->nullable();
            $table->string('CIN')->unique();
            $table->string('image')->nullable();
            $table->integer('age')->nullable();
            $table->string('sexe')->nullable();
            $table->string('sanguim')->nullable();
            $table->string('situation_familiale')->nullable();
            $table->text('adresse')->nullable();
            $table->date('dateArrive')->nullable();
            $table->time('heure')->nullable();
            $table->string('etat_maladie')->nullable();
            $table->string('etat_patient')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
