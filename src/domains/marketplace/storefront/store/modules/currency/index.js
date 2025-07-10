"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _services_1 = require("@services");
var initial_data_1 = require("./loaders/initial-data");
var utils_1 = require("@medusajs/framework/utils");
var service = _services_1.CurrencyModuleService;
var loaders = [initial_data_1.default];
exports.default = (0, utils_1.Module)(utils_1.Modules.CURRENCY, {
    service: service,
    loaders: loaders,
});
