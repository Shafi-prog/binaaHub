// Order List Table Component
import React from 'react';

export const OrderListTable: React.FC = () => {
  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">قائمة الطلبات</h2>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-right">رقم الطلب</th>
              <th className="p-3 text-right">العميل</th>
              <th className="p-3 text-right">المبلغ الإجمالي</th>
              <th className="p-3 text-right">الحالة</th>
              <th className="p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 text-center" colSpan={5}>
                لا توجد طلبات حالياً. وظائف إدارة الطلبات قيد التطوير...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListTable;
