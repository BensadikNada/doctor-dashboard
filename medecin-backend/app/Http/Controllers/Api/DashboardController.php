<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Reservation;
// use App\Models\Payment;
use App\Models\Consultation;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary()
{
    $patientCount = Patient::count();
    $appointmentCount = Reservation::count();
    $consultationCount = Consultation::count();

    $year = now()->year;
    $months = range(1, 12);
    $monthlyConsultationsData = [];
    $monthlyReservationsData = [];

    // Initialize with zeros for all months
    foreach ($months as $month) {
        $formattedMonth = sprintf('%04d-%02d', $year, $month);
        $monthlyConsultationsData[$formattedMonth] = ['month' => $formattedMonth, 'count' => 0];
        $monthlyReservationsData[$formattedMonth] = ['month' => $formattedMonth, 'count' => 0];
    }

    // Consultations
    $monthlyConsultations = Consultation::selectRaw('YEAR(consultation_date) as year, MONTH(consultation_date) as month, COUNT(*) as count')
        ->whereYear('consultation_date', $year)
        ->groupBy('year', 'month')
        ->get();

    foreach ($monthlyConsultations as $mc) {
        $formattedMonth = sprintf('%04d-%02d', $mc->year, $mc->month);
        $monthlyConsultationsData[$formattedMonth]['count'] = $mc->count;
    }

    // Reservations
    $monthlyReservations = Reservation::selectRaw('YEAR(reservation_date) as year, MONTH(reservation_date) as month, COUNT(*) as count')
        ->whereYear('reservation_date', $year)
        ->groupBy('year', 'month')
        ->get();

    foreach ($monthlyReservations as $mr) {
        $formattedMonth = sprintf('%04d-%02d', $mr->year, $mr->month);
        $monthlyReservationsData[$formattedMonth]['count'] = $mr->count;
    }

    return response()->json([
        'patientCount' => $patientCount,
        'appointmentCount' => $appointmentCount,
        'consultationCount' => $consultationCount,
        'monthlyConsultations' => array_values($monthlyConsultationsData), // Reset array indexes for JSON array format
        'monthlyReservations' => array_values($monthlyReservationsData),
    ]);
}


}
