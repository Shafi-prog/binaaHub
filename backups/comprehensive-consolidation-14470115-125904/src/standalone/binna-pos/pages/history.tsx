import React from 'react';

const SalesHistory: React.FC = () => {
  // Placeholder for sales history data
  const sales = [
    { id: '001', date: '2025-07-09', total: 120.5, cashier: 'Ali' },
    { id: '002', date: '2025-07-09', total: 75.0, cashier: 'Sara' },
  ];

  return (
    <div style={{ maxWidth: 480, margin: '32px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24 }}>
      <h2>Sales History</h2>
      <table style={{ width: '100%', fontSize: 14 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Cashier</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.date}</td>
              <td>{sale.total.toFixed(2)}</td>
              <td>{sale.cashier}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesHistory;
