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
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->date('consultation_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('prescription')->nullable();
            $table->text('notes')->nullable();
            $table->decimal('consultation_fee', 8, 2)->nullable();
            $table->boolean('follow_up_needed')->default(false)->nullable();
            $table->date('follow_up_date')->nullable();
            $table->decimal('body_temperature', 5, 2)->nullable();
            $table->decimal('body_weight_kg', 8, 2)->nullable();
            $table->decimal('blood_pressure', 5, 2)->nullable();
            $table->decimal('blood_sugar', 8, 2)->nullable();
            $table->string('symptoms')->nullable();
            $table->string('medical_history')->nullable();
            $table->string('allergies')->nullable();
            $table->string('lab_tests')->nullable();
            $table->string('family_medical_history')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('consultations');
    }
};
