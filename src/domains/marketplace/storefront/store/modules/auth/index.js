"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _services_1 = require("@services");
var providers_1 = require("./loaders/providers");
var utils_1 = require("@medusajs/framework/utils");
exports.default = (0, utils_1.Module)(utils_1.Modules.AUTH, {
    service: _services_1.AuthModuleService,
    loaders: [providers_1.default],
});
