// Minimal shim for @platform/framework/types used by legacy utils
export type Constructor<T = any> = new (...args: any[]) => T
export type Context = any
export type DAL = any
export type IndexTypes = any
export type ModulesSdkTypes = any
export type MedusaContainer = any
export type ModuleProviderExports = any
export type ModuleServiceInitializeOptions = any
export type BigNumberInput = number | string | bigint
export type OrderTypes = any
export type FulfillmentTypes = any
export type PromotionTypes = any
export type PromotionDTO = any
export type PromotionRuleDTO = any
export type PromotionRuleOperatorValues = any
export type DistributedTransactionType = any
export namespace GraphQLUtils {
	export type GraphQLSchema = string
}

export default {}
