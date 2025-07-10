// Customer List Table Component
import React from 'react';

export const CustomerListTable: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Customer List</h2>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3" colSpan={4}>
                No customers found. Customer list functionality coming soon...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerListTable;
