// @ts-nocheck
import { DALUtils } from "@medusajs/framework/utils"
import { Order } from "@models"
import { setFindMethods } from "@/domains/shared/utils/base-repository-find"

export class OrderRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  Order
) {}

setFindMethods(OrderRepository, Order)


