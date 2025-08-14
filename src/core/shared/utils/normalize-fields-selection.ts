// @ts-nocheck
// Use the local polyfill from our jest mock mapping in unit tests; in app it won't be bundled
import { objectFromStringPath } from "@platform/framework/utils"

export function normalizeFieldsSelection(fields: string[]) {
  const normalizedFields = fields.map((field) => field.replace(/\.\*/g, ""))
  const fieldsObject = objectFromStringPath(normalizedFields)
  return fieldsObject
}




