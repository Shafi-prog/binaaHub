import { z } from "zod"

export const optionalInt = z
  .union([z.string(), z.number()])
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val === '') return undefined
    const num = typeof val === 'string' ? parseInt(val, 10) : val
    return isNaN(num) ? undefined : num
  })

export const optionalFloat = z
  .union([z.string(), z.number()])
  .optional()
  .transform((val) => {
    if (val === undefined || val === null || val === '') return undefined
    const num = typeof val === 'string' ? parseFloat(val) : val
    return isNaN(num) ? undefined : num
  })

export const requiredInt = z
  .union([z.string(), z.number()])
  .transform((val) => {
    const num = typeof val === 'string' ? parseInt(val, 10) : val
    if (isNaN(num)) throw new Error('Invalid number')
    return num
  })

export const requiredFloat = z
  .union([z.string(), z.number()])
  .transform((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val
    if (isNaN(num)) throw new Error('Invalid number')
    return num
  })

export const partialFormValidation = <T>(
  schema: z.ZodSchema<T>,
  data: any
): { isValid: boolean; errors: string[] } => {
  try {
    schema.parse(data)
    return { isValid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      }
    }
    return { isValid: false, errors: ['Validation failed'] }
  }
}
