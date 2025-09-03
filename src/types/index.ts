// @ts-nocheck
import {
  ApiKeyType,
  IEventBusModuleService,
  Logger,
  RevokeApiKeyDTO,
  UpdateApiKeyDTO,
} from "@platform/framework/types"

export type InitializeModuleInjectableDependencies  = {
  logger?: Logger
  EventBus?: IEventBusModuleService
}

export type CreateApiKeyDTO = {
  token: string
  salt: string
  redacted: string
  title: string
  type: ApiKeyType
  created_by: string
}

export type TokenDTO = {
  rawToken: string
  hashedToken: string
  salt: string
  redacted: string
}

export type UpdateApiKeyInput = UpdateApiKeyDTO & { id: string }
export type RevokeApiKeyInput = RevokeApiKeyDTO & { id: string }




// Jest/unit-friendly default for omitted schema properties used in build-config utilities
export const schemaObjectRepresentationPropertiesToOmit: string[] = [
  "__meta",
  "__typename",
  "created_at",
  "updated_at",
  "_serviceNameModuleConfigMap",
]




