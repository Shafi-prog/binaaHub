// Jest mock for '@supabase/auth-helpers-nextjs'
// Provides a minimal client with chainable methods used in components

export const createClientComponentClient = () => {
  const chain = {
    select: (..._args: any[]) => Promise.resolve({ data: [], error: null }),
    eq: (..._args: any[]) => chain,
    limit: (..._args: any[]) => chain,
    update: (..._args: any[]) => ({ eq: (..._a: any[]) => Promise.resolve({ data: null, error: null }) }),
    insert: (..._args: any[]) => ({ select: (..._a: any[]) => ({ single: () => Promise.resolve({ data: { id: '1' }, error: null }) }) }),
    single: () => Promise.resolve({ data: null, error: null })
  } as any

  return {
    from: (_table: string) => chain,
  }
}
