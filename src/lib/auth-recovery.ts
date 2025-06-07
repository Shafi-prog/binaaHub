export async function verifyAuthWithRetry(retries: number = 3): Promise<any> {
  // Dummy implementation for build
  return { id: 'dummy-user', email: 'dummy@example.com' };
}
