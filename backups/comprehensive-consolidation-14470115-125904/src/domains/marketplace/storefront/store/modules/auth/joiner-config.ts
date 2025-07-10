// @ts-nocheck
import { ModuleJoinerConfig } from "@medusajs/framework/types";
import { defineJoinerConfig, Modules } from "@medusajs/framework/utils"
import { AuthIdentity, ProviderIdentity } from "@models"

export const joinerConfig = defineJoinerConfig(Modules.AUTH, {
  models: [AuthIdentity, ProviderIdentity],
})


