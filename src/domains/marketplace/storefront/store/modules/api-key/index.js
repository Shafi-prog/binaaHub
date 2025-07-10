"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@medusajs/framework/utils");
var _services_1 = require("@services");
exports.default = (0, utils_1.Module)(utils_1.Modules.API_KEY, {
    service: _services_1.ApiKeyModuleService,
});
