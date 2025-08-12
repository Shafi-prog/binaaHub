// Focused jest mock for @medusajs/framework/utils used by build-config and utils tests

// ---- Minimal BigNumber/MathBN implementation ----
export class BigNumber {
  numeric: number
  constructor(value: any) {
    this.numeric = Number(value)
  }
  toString() {
    return String(this.numeric)
  }
}

export const MathBN = {
  mult: (a: any, b: any) => Number(a) * Number(b),
  div: (a: any, b: any) => Number(a) / Number(b),
}

// ---- RuleOperator for client-side utils tests ----
export const RuleOperator = {
  EQ: 'eq',
  NE: 'ne',
  GT: 'gt',
  GTE: 'gte',
  LT: 'lt',
  LTE: 'lte',
  IN: 'in',
  NIN: 'nin',
} as const

// ---- Utility functions used around the codebase ----
export const kebabCase = (s: string): string =>
  s
    ? String(s)
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase()
    : ''
export const lowerCaseFirst = (s: string): string => (s ? s.charAt(0).toLowerCase() + s.slice(1) : '')

// Common events used to construct listener names in build-config
export const CommonEvents = {
  ATTACHED: 'attached',
  DETACHED: 'detached',
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
} as const

// Build event name like `${prefix}.${object}.${action}`
export const buildModuleResourceEventName = ({
  action,
  objectName,
  prefix,
}: {
  action: string
  objectName: string
  prefix: string
}): string => {
  const obj = lowerCaseFirst(kebabCase(String(objectName || '')))
  const pfx = String(prefix || '').replace(/\s+/g, '')
  const act = String(action || '').replace(/\s+/g, '')
  if (!pfx) return `${obj}.${act}`
  return `${pfx}.${obj}.${act}`
}

// Convert ["a.b", "a.c.d"] into { a: { b: true, c: { d: true } } }
export const objectFromStringPath = (paths: string[]): Record<string, any> => {
  const root: Record<string, any> = {}
  for (const path of paths || []) {
    if (!path) continue
    const segments = String(path).split('.')
    let cursor: any = root
    for (let i = 0; i < segments.length; i++) {
      const key = segments[i]
      const isLeaf = i === segments.length - 1
      if (isLeaf) {
        // If something already exists, keep structure but mark leaf
        if (cursor[key] && typeof cursor[key] === 'object') {
          // leave nested as is
        } else {
          cursor[key] = true
        }
      } else {
        cursor[key] = cursor[key] && typeof cursor[key] === 'object' ? cursor[key] : {}
        cursor = cursor[key]
      }
    }
  }
  // Replace any boolean leaves with true and ensure objects remain
  const normalize = (obj: any) => {
    for (const k of Object.keys(obj)) {
      if (obj[k] && typeof obj[k] === 'object') {
        normalize(obj[k])
      } else {
        obj[k] = true
      }
    }
  }
  normalize(root)
  return root
}

// ---- Extremely lightweight GraphQL schema builder sufficient for tests ----
type FieldAst = { name: { value: string }; type: any }
type TypeEntry = {
  name: string
  astNode?: { kind: string; fields?: FieldAst[]; directives?: any[] }
  _fields?: Record<string, { name: string; type: { toString: () => string; astNode?: { kind: string } } }>
}

function parseFieldType(typeStr: string): any {
  // Remove directives on the same line
  const clean = typeStr.split('@')[0].trim()

  // Handle list and non-null nesting like [Type!]!
  function wrapNonNull(inner: any) {
    return { kind: 'NonNullType', type: inner }
  }
  function wrapList(inner: any) {
    return { kind: 'ListType', type: inner }
  }

  let i = 0
  function parse(): any {
    if (clean[i] === '[') {
      // list
      i++
      const inner = parse()
      if (clean[i] === ']') i++
      let node = wrapList(inner)
      if (clean[i] === '!') {
        i++
        node = wrapNonNull(node)
      }
      return node
    }
    // named type
    let name = ''
    while (i < clean.length && /[A-Za-z0-9_]/.test(clean[i])) {
      name += clean[i++]
    }
    let node: any = { name: { value: name } }
    if (clean[i] === '!') {
      i++
      node = wrapNonNull(node)
    }
    return node
  }

  return parse()
}

function parseSchemaToTypeMap(typeDefs: string): Record<string, TypeEntry> {
  const map: Record<string, TypeEntry> = {}
  const src = typeDefs || ''

  // Scalars
  const scalarRe = /scalar\s+(\w+)/g
  let m: RegExpExecArray | null
  while ((m = scalarRe.exec(src))) {
    const name = m[1]
    map[name] = { name, astNode: { kind: 'SCALAR_TYPE_DEFINITION' } }
  }

  // Enums
  const enumRe = /enum\s+(\w+)\s*\{[\s\S]*?\}/g
  while ((m = enumRe.exec(src))) {
    const name = m[1]
    map[name] = { name, astNode: { kind: 'EnumTypeDefinition' } }
  }

  // Object types
  const typeRe = /type\s+(\w+)([^\{]*)\{([\s\S]*?)\}/g
  let mt: RegExpExecArray | null
  while ((mt = typeRe.exec(src))) {
    const name = mt[1]
    const pre = (mt[2] || '').trim()
    const body = mt[3]
    const lines = body
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
    // Parse directives on the type line (e.g., @Listeners(values: ["a.created"]))
    const directives: any[] = []
    const dirRe = /@(\w+)\s*\(\s*values\s*:\s*\[([^\]]*)\]\s*\)/g
    let md: RegExpExecArray | null
    while ((md = dirRe.exec(pre))) {
      const dirName = md[1]
      const valuesStr = md[2]
      const values = valuesStr
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => v.replace(/^[\'\"]/ , '').replace(/[\'\"]$/ , ''))
        .filter((v) => v && v !== 'undefined')
      directives.push({
        name: { value: dirName },
        arguments: [
          {
            value: {
              values: values.map((val) => ({ value: val })),
            },
          },
        ],
      })
    }

    const fields: FieldAst[] = []
    const _fields: TypeEntry['_fields'] = {}

    for (const line of lines) {
      // field: Type ... (ignore args and directives)
      const match = line.match(/^(\w+)\s*:\s*([^@]+)(?:@.*)?$/)
      if (!match) continue
      const fieldName = match[1]
      const typeStr = match[2].trim()
      const typeAst = parseFieldType(typeStr)
      fields.push({ name: { value: fieldName }, type: typeAst })
      _fields![fieldName] = {
        name: fieldName,
        type: {
          toString: () => typeStr.replace(/\s+/g, ''),
          // For tests that check enum, we don't need special handling per field type
        },
      }
    }

    map[name] = {
      name,
      astNode: { kind: 'ObjectTypeDefinition', fields, directives },
      _fields,
    }
  }

  // Extend object types: merge fields and directives into existing entries
  const extendRe = /extend\s+type\s+(\w+)([^\{]*)\{([\s\S]*?)\}/g
  let me: RegExpExecArray | null
  while ((me = extendRe.exec(src))) {
    const name = me[1]
    const pre = (me[2] || '').trim()
    const body = me[3]
    if (!map[name]) {
      map[name] = { name, astNode: { kind: 'ObjectTypeDefinition', fields: [], directives: [] }, _fields: {} }
    }

    // Parse directives on the extend line
    const directives: any[] = []
    const dirRe = /@(\w+)\s*\(\s*values\s*:\s*\[([^\]]*)\]\s*\)/g
    let md: RegExpExecArray | null
    while ((md = dirRe.exec(pre))) {
      const dirName = md[1]
      const valuesStr = md[2]
      const values = valuesStr
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => v.replace(/^[\'\"]/ , '').replace(/[\'\"]$/ , ''))
        .filter((v) => v && v !== 'undefined')
      directives.push({
        name: { value: dirName },
        arguments: [
          {
            value: {
              values: values.map((val) => ({ value: val })),
            },
          },
        ],
      })
    }

    const lines = body
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))

    for (const line of lines) {
      const match = line.match(/^(\w+)\s*:\s*([^@]+)(?:@.*)?$/)
      if (!match) continue
      const fieldName = match[1]
      const typeStr = match[2].trim()
      const typeAst = parseFieldType(typeStr)
      ;(map[name].astNode!.fields as FieldAst[]).push({ name: { value: fieldName }, type: typeAst })
      ;(map[name]._fields as any)[fieldName] = {
        name: fieldName,
        type: { toString: () => typeStr.replace(/\s+/g, '') },
      }
    }

    if (directives.length) {
      const existing = (map[name].astNode!.directives as any[]) || []
      map[name].astNode!.directives = existing.concat(directives)
    }
  }

  return map
}

export const GraphQLUtils = {
  Kind: {
    LIST_TYPE: 'ListType',
    ENUM_TYPE_DEFINITION: 'EnumTypeDefinition',
    SCALAR_TYPE_DEFINITION: 'SCALAR_TYPE_DEFINITION',
  },
  cleanGraphQLSchema: (schema: string): { schema: string } => ({ schema }),
  makeExecutableSchema: ({ typeDefs }: { typeDefs: string }): any => {
    const typeMap = parseSchemaToTypeMap(typeDefs)
    return {
      getTypeMap: () => typeMap,
    }
  },
  gqlGetFieldsAndRelations: (entitiesMap: Record<string, any>, entityName: string): string[] => {
    const entry = entitiesMap?.[entityName]
    if (!entry || !entry._fields) return []
    const builtins = new Set(['ID', 'String', 'Int', 'Float', 'Boolean', 'Date', 'DateTime'])
    const results: string[] = []
    for (const [fname, finfo] of Object.entries<any>(entry._fields)) {
      const t = finfo.type?.toString?.() || ''
      const base = t.replace(/\[|\]|!/g, '')
      // relation if base exists as an object type in the map and is not a scalar/enum
      const isRelation = !builtins.has(base) && entitiesMap?.[base]?.astNode?.kind === 'ObjectTypeDefinition'
      if (!isRelation) {
        results.push(fname)
      }
    }
    return results
  },
}

