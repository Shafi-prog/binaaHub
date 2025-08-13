// Jest mock for '@supabase/auth-helpers-nextjs'
// Provides a minimal client with chainable, thenable query builders used in components

type TableData = Record<string, any[]>;

let mockData: TableData = {};

export const configureSupabaseMockData = (data: TableData) => {
  mockData = data || {};
};

function makeThenable<T>(value: T) {
  return {
    then: (resolve: (v: T) => any) => resolve(value),
  } as unknown as Promise<T> & Record<string, any>;
}

function makeQueryChain(table: string) {
  const getTable = () => mockData[table] || [];

  const chain: any = {
    _filters: [] as Array<{ key: string; op: string; val: any }>,
    select: (..._args: any[]) => chain,
    eq: (key: string, val: any) => {
      chain._filters.push({ key, op: 'eq', val });
      return chain;
    },
    limit: (_count: number) => chain,
    update: (..._args: any[]) => ({
      eq: (..._a: any[]) => makeThenable({ data: null, error: null }),
    }),
    insert: (..._args: any[]) => ({
      select: (..._a: any[]) => ({
        single: () => makeThenable({ data: { id: '1' }, error: null }),
      }),
    }),
    single: () => makeThenable({ data: null, error: null }),
  };

  // Make the chain awaitable like supabase-js builders
  (chain as any).then = (resolve: (v: any) => any) => {
    let data = getTable();
    // Apply simple eq filters
    for (const f of chain._filters) {
      if (f.op === 'eq') {
        data = data.filter((row: any) => row?.[f.key] === f.val);
      }
    }
    return resolve({ data, error: null });
  };

  return chain;
}

export const createClientComponentClient = () => {
  return {
    from: (table: string) => makeQueryChain(table),
  } as any;
};

