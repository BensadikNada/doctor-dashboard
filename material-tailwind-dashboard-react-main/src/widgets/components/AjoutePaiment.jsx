import React, { useState, useEffect } from 'react';
import axiosClient from '@/hooks/axiosClient';

const AjoutePaiment = ({ onClose, consultationId, fetchConsultations ,consultation}) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, [consultation.id]);

  const fetchPayments = async () => {
    try {
      const response = await axiosClient.get(`consultations/${consultation.id}/payments`);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const paymentData = {
        consultation_id: consultation.id,
        amount_paid: paymentAmount,
      };
      await axiosClient.post('payments', paymentData);
      fetchPayments();
      fetchConsultations();
      onClose();
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleClose = () => {
    setPaymentAmount('');
    onClose();
  };

  return (
    <div className="px-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Ajouter un paiement</h1>
      </div>
      <div className="bg-white shadow-xl overflow-auto w-full rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div>
            <label className="mb-2">Montant du paiement</label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            className="px-4 py-2 mr-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
            onClick={handleSubmit}
          >
            Ajouter un paiement
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            onClick={handleClose}
          >
            Annuler
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-900">Historique des paiements</h2>
        <table className="min-w-full divide-y divide-gray-200 mt-2">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Paid</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Paid</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map(payment => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">{payment.amount_paid}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AjoutePaiment;
