// Minimal shim for @platform/framework/utils (runtime only for tests)
export const RuleOperator: any = {
  EQ: 'eq',
  NE: 'ne',
  GT: 'gt',
  GTE: 'gte',
  LT: 'lt',
  LTE: 'lte',
  IN: 'in',
  NIN: 'nin',
}

export const MathBN: any = {
  convert: (v: any) => Number(v) || 0,
  add: (a: any, b: any) => Number(a) + Number(b),
  sub: (a: any, b: any) => Number(a) - Number(b),
  mult: (a: any, b: any) => Number(a) * Number(b),
  lt: (a: any, b: any) => Number(a) < Number(b),
  abs: (a: any) => Math.abs(Number(a)),
}

export class BigNumber {
  numeric: number
  constructor(v: any) {
    this.numeric = Number(v) || 0
  }
  toString() {
    return String(this.numeric)
  }
  toNumber() {
    return this.numeric
  }
}

export const MedusaError: any = class extends Error {}
export const ChangeActionType: any = {}
export const objectFromStringPath: any = (obj: any, path?: string) => {
  if (!path) return undefined
  return path.split('.').reduce((o,p) => (o ? (o as any)[p] : undefined), obj)
}
export const isDate = (v: any) => v instanceof Date || (!isNaN(Date.parse(v)))
export const simpleHash = (s: string) => {
  let h = 0
  for (let i=0;i<s.length;i++) { h = (h<<5)-h + s.charCodeAt(i); h|=0 }
  return Math.abs(h).toString(36)
}
export const compressName = (s: string) => s.replace(/[^a-zA-Z0-9]+/g,'_').toLowerCase()
export const toMikroORMEntity = <T=any>(v: any) => v as T

export const GraphQLUtils: any = {
  Kind: {
    LIST_TYPE: 'ListType',
    ENUM_TYPE_DEFINITION: 'EnumTypeDefinition',
    SCALAR_TYPE_DEFINITION: 'SCALAR_TYPE_DEFINITION',
  },
  cleanGraphQLSchema: (inputSchema: string) => ({ schema: inputSchema }),
  makeExecutableSchema: ({ typeDefs }: { typeDefs: string }) => ({
    getTypeMap: () => ({}),
  }),
}

export default {}
