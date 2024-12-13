import React, { useState, useEffect } from "react";
import axiosClient from "@/hooks/axiosClient";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { CheckCircleIcon, ClockIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import StatisticsCard from "@/widgets/cards/statistics-card";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

export function Home() {
  const [dashboardSummary, setDashboardSummary] = useState({
    patientCount: 0,
    appointmentCount: 0,
    consultationCount: 0,
    monthlyConsultations: [],
    monthlyReservations: [],
  });

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const { data } = await axiosClient.get("dashboard-summary");
        setDashboardSummary(data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      }
    };

    fetchDashboardSummary();
  }, []);

  // Prepare the chart data for monthly consultations and reservations
  const monthlyChartData = (data) => ({
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Count',
        data: data.map(item => item.count),
        backgroundColor: 'black',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  });

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <StatisticsCard
          icon={<CheckCircleIcon className="w-8 h-8 text-white" />}
          title="Patients"
          value={dashboardSummary.patientCount}
          color="blue"
        />
        <StatisticsCard
          icon={<ClockIcon className="w-8 h-8 text-white" />}
          title="Rendez-vous"
          value={dashboardSummary.appointmentCount}
          color="green"
        />
        <StatisticsCard
          icon={<ArrowUpIcon className="w-8 h-8 text-white" />}
          title="Consultations"
          value={dashboardSummary.consultationCount}
          color="red"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 text-black rounded-xl">
          <h2 className="text-center mb-4">Consultations mensuelles</h2>
          <Line data={monthlyChartData(dashboardSummary.monthlyConsultations)} />
        </div>
        <div className="bg-white p-4 text-black rounded-xl">
          <h2 className="text-center mb-4">Réservations mensuelles</h2>
          <Bar data={monthlyChartData(dashboardSummary.monthlyReservations)} />
        </div>
      </div>
    </div>
  );
}

export default Home;
