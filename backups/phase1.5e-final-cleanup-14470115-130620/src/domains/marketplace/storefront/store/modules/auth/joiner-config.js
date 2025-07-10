"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerConfig = void 0;
var utils_1 = require("@medusajs/framework/utils");
var _models_1 = require("@models");
exports.joinerConfig = (0, utils_1.defineJoinerConfig)(utils_1.Modules.AUTH, {
    models: [_models_1.AuthIdentity, _models_1.ProviderIdentity],
});
