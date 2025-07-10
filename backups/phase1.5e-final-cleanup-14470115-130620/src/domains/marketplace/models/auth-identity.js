"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthIdentity = void 0;
var utils_1 = require("@medusajs/framework/utils");
var provider_identity_1 = require("./provider-identity");
exports.AuthIdentity = utils_1.model
    .define("auth_identity", {
    id: utils_1.model.id({ prefix: "authid" }).primaryKey(),
    provider_identities: utils_1.model.hasMany(function () { return provider_identity_1.ProviderIdentity; }, {
        mappedBy: "auth_identity",
    }),
    app_metadata: utils_1.model.json().nullable(),
})
    .cascades({
    delete: ["provider_identities"],
});
