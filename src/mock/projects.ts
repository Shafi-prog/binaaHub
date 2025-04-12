export function getMockProjectsByUser(userId: string) {
    return [
      { id: 1, userId, name: 'مشروع فيلا النرجس', stage: 'الحفر', progress: 20 },
      { id: 2, userId, name: 'مشروع شقة العليا', stage: 'العظم', progress: 65 },
    ];
  }
  