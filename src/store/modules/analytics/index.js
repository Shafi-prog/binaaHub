"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@medusajs/framework/utils");
var analytics_service_1 = require("./services/analytics-service");
var providers_1 = require("./loaders/providers");
exports.default = (0, utils_1.Module)(utils_1.Modules.ANALYTICS, {
    service: analytics_service_1.default,
    loaders: [providers_1.default],
});
