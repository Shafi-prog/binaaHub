export function getMockOrdersByUser(userId: string) {
  return [
    { id: 1, userId, item: 'بلك أسود 20 سم', date: '2025-04-01', status: 'قيد التوصيل' },
    { id: 2, userId, item: 'حديد تسليح 12مم', date: '2025-03-27', status: 'تم التوصيل' },
  ];
}
