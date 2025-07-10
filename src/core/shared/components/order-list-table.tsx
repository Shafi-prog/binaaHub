// Order List Table Component
import React from 'react';

export const OrderListTable: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order List</h2>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3" colSpan={5}>
                No orders found. Order list functionality coming soon...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListTable;
