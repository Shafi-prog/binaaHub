export function getMockWarrantiesByUser(userId: string) {
    return [
      {
        id: 1,
        userId,
        item: 'سخان كهربائي',
        store: 'متجر الأجهزة',
        purchaseDate: '2023-03-20',
        warrantyYears: 2,
        expiryDate: '2025-03-20',
        isActive: true,
      },
      {
        id: 2,
        userId,
        item: 'مكيف',
        store: 'مكيفات الخليج',
        purchaseDate: '2022-01-15',
        warrantyYears: 1,
        expiryDate: '2023-01-15',
        isActive: false,
      },
    ];
  }
  