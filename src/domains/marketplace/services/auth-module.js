"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@medusajs/framework/utils");
var _models_1 = require("@models");
var joiner_config_1 = require("../joiner-config");
var AuthModuleService = function () {
    var _a;
    var _classSuper = (0, utils_1.MedusaService)({ AuthIdentity: _models_1.AuthIdentity, ProviderIdentity: _models_1.ProviderIdentity });
    var _instanceExtraInitializers = [];
    var _createAuthIdentities_decorators;
    var _updateAuthIdentities_decorators;
    var _createProviderIdentities_decorators;
    var _updateProviderIdentities_decorators;
    return _a = /** @class */ (function (_super) {
            __extends(AuthModuleService, _super);
            function AuthModuleService(_b, moduleDeclaration) {
                var authIdentityService = _b.authIdentityService, providerIdentityService = _b.providerIdentityService, authProviderService = _b.authProviderService, baseRepository = _b.baseRepository, cache = _b.cache;
                // @ts-ignore
                var _this = _super.apply(this, arguments) || this;
                _this.moduleDeclaration = (__runInitializers(_this, _instanceExtraInitializers), moduleDeclaration);
                _this.baseRepository_ = baseRepository;
                _this.authIdentityService_ = authIdentityService;
                _this.authProviderService_ = authProviderService;
                _this.providerIdentityService_ = providerIdentityService;
                _this.cache_ = cache;
                return _this;
            }
            AuthModuleService.prototype.__joinerConfig = function () {
                return joiner_config_1.joinerConfig;
            };
            AuthModuleService.prototype.createAuthIdentities = function (data_1) {
                return __awaiter(this, arguments, void 0, function (data, sharedContext) {
                    var authIdentities;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.authIdentityService_.create(data, sharedContext)];
                            case 1:
                                authIdentities = _b.sent();
                                return [4 /*yield*/, this.baseRepository_.serialize(authIdentities, {
                                        populate: true,
                                    })];
                            case 2: return [2 /*return*/, _b.sent()];
                        }
                    });
                });
            };
            AuthModuleService.prototype.updateAuthIdentities = function (data_1) {
                return __awaiter(this, arguments, void 0, function (data, sharedContext) {
                    var updatedUsers, serializedUsers;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.authIdentityService_.update(data, sharedContext)];
                            case 1:
                                updatedUsers = _b.sent();
                                return [4 /*yield*/, this.baseRepository_.serialize(updatedUsers, {
                                        populate: true,
                                    })];
                            case 2:
                                serializedUsers = _b.sent();
                                return [2 /*return*/, serializedUsers];
                        }
                    });
                });
            };
            AuthModuleService.prototype.register = function (provider, authenticationData) {
                return __awaiter(this, void 0, void 0, function () {
                    var error_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.authProviderService_.register(provider, authenticationData, this.getAuthIdentityProviderService(provider))];
                            case 1: return [2 /*return*/, _b.sent()];
                            case 2:
                                error_1 = _b.sent();
                                return [2 /*return*/, { success: false, error: error_1.message }];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
            AuthModuleService.prototype.createProviderIdentities = function (data_1) {
                return __awaiter(this, arguments, void 0, function (data, sharedContext) {
                    var providerIdentities;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.providerIdentityService_.create(data, sharedContext)];
                            case 1:
                                providerIdentities = _b.sent();
                                return [4 /*yield*/, this.baseRepository_.serialize(providerIdentities)];
                            case 2: return [2 /*return*/, _b.sent()];
                        }
                    });
                });
            };
            AuthModuleService.prototype.updateProviderIdentities = function (data_1) {
                return __awaiter(this, arguments, void 0, function (data, sharedContext) {
                    var updatedProviders, serializedProviders;
                    if (sharedContext === void 0) { sharedContext = {}; }
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.providerIdentityService_.update(data, sharedContext)];
                            case 1:
                                updatedProviders = _b.sent();
                                return [4 /*yield*/, this.baseRepository_.serialize(updatedProviders)];
                            case 2:
                                serializedProviders = _b.sent();
                                return [2 /*return*/, serializedProviders];
                        }
                    });
                });
            };
            AuthModuleService.prototype.updateProvider = function (provider, data) {
                return __awaiter(this, void 0, void 0, function () {
                    var error_2;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.authProviderService_.update(provider, data, this.getAuthIdentityProviderService(provider))];
                            case 1: return [2 /*return*/, _b.sent()];
                            case 2:
                                error_2 = _b.sent();
                                return [2 /*return*/, { success: false, error: error_2.message }];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
            AuthModuleService.prototype.authenticate = function (provider, authenticationData) {
                return __awaiter(this, void 0, void 0, function () {
                    var error_3;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.authProviderService_.authenticate(provider, authenticationData, this.getAuthIdentityProviderService(provider))];
                            case 1: return [2 /*return*/, _b.sent()];
                            case 2:
                                error_3 = _b.sent();
                                return [2 /*return*/, { success: false, error: error_3.message }];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
            AuthModuleService.prototype.validateCallback = function (provider, authenticationData) {
                return __awaiter(this, void 0, void 0, function () {
                    var error_4;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.authProviderService_.validateCallback(provider, authenticationData, this.getAuthIdentityProviderService(provider))];
                            case 1: return [2 /*return*/, _b.sent()];
                            case 2:
                                error_4 = _b.sent();
                                return [2 /*return*/, { success: false, error: error_4.message }];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
            AuthModuleService.prototype.getAuthIdentityProviderService = function (provider) {
                var _this = this;
                return {
                    retrieve: function (_b) { return __awaiter(_this, [_b], void 0, function (_c) {
                        var authIdentities;
                        var entity_id = _c.entity_id;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, this.authIdentityService_.list({
                                        provider_identities: {
                                            entity_id: entity_id,
                                            provider: provider,
                                        },
                                    }, {
                                        relations: ["provider_identities"],
                                    })];
                                case 1:
                                    authIdentities = _d.sent();
                                    if (!authIdentities.length) {
                                        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, "AuthIdentity with entity_id \"".concat(entity_id, "\" not found"));
                                    }
                                    if (authIdentities.length > 1) {
                                        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Multiple authIdentities found for entity_id \"".concat(entity_id, "\""));
                                    }
                                    return [4 /*yield*/, this.baseRepository_.serialize(authIdentities[0])];
                                case 2: return [2 /*return*/, _d.sent()];
                            }
                        });
                    }); },
                    create: function (data) { return __awaiter(_this, void 0, void 0, function () {
                        var normalizedRequest, createdAuthIdentity;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    normalizedRequest = {
                                        provider_identities: [
                                            {
                                                entity_id: data.entity_id,
                                                provider_metadata: data.provider_metadata,
                                                user_metadata: data.user_metadata,
                                                provider: provider,
                                            },
                                        ],
                                    };
                                    return [4 /*yield*/, this.authIdentityService_.create(normalizedRequest)];
                                case 1:
                                    createdAuthIdentity = _b.sent();
                                    return [4 /*yield*/, this.baseRepository_.serialize(createdAuthIdentity)];
                                case 2: return [2 /*return*/, _b.sent()];
                            }
                        });
                    }); },
                    update: function (entity_id, data) { return __awaiter(_this, void 0, void 0, function () {
                        var authIdentities, providerIdentityData, updatedProviderIdentity, serializedResponse, serializedProviderIdentity;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0: return [4 /*yield*/, this.authIdentityService_.list({
                                        provider_identities: {
                                            entity_id: entity_id,
                                            provider: provider,
                                        },
                                    }, {
                                        relations: ["provider_identities"],
                                    })];
                                case 1:
                                    authIdentities = _d.sent();
                                    if (!authIdentities.length) {
                                        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, "AuthIdentity with entity_id \"".concat(entity_id, "\" not found"));
                                    }
                                    if (authIdentities.length > 1) {
                                        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Multiple authIdentities found for entity_id \"".concat(entity_id, "\""));
                                    }
                                    providerIdentityData = authIdentities[0].provider_identities.find(function (pi) { return pi.provider === provider; });
                                    if (!providerIdentityData) {
                                        throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, "ProviderIdentity with entity_id \"".concat(entity_id, "\" not found"));
                                    }
                                    return [4 /*yield*/, this.providerIdentityService_.update(__assign({ id: providerIdentityData.id }, data))];
                                case 2:
                                    updatedProviderIdentity = _d.sent();
                                    return [4 /*yield*/, this.baseRepository_.serialize(authIdentities[0])];
                                case 3:
                                    serializedResponse = _d.sent();
                                    return [4 /*yield*/, this.baseRepository_.serialize(updatedProviderIdentity)];
                                case 4:
                                    serializedProviderIdentity = _d.sent();
                                    serializedResponse.provider_identities = __spreadArray(__spreadArray([], ((_c = (_b = serializedResponse.provider_identities) === null || _b === void 0 ? void 0 : _b.filter(function (p) { return p.provider !== provider; })) !== null && _c !== void 0 ? _c : []), true), [
                                        serializedProviderIdentity,
                                    ], false);
                                    return [2 /*return*/, serializedResponse];
                            }
                        });
                    }); },
                    setState: function (key, value) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_b) {
                            if (!this.cache_) {
                                throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_ARGUMENT, "Cache module dependency is required when using OAuth providers that require state");
                            }
                            // 20 minutes. Can be made configurable if necessary, but this is a good default.
                            this.cache_.set(key, value, 1200);
                            return [2 /*return*/];
                        });
                    }); },
                    getState: function (key) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!this.cache_) {
                                        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_ARGUMENT, "Cache module dependency is required when using OAuth providers that require state");
                                    }
                                    return [4 /*yield*/, this.cache_.get(key)];
                                case 1: return [2 /*return*/, _b.sent()];
                            }
                        });
                    }); },
                };
            };
            return AuthModuleService;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _createAuthIdentities_decorators = [(0, utils_1.InjectManager)()];
            _updateAuthIdentities_decorators = [(0, utils_1.InjectManager)()];
            _createProviderIdentities_decorators = [(0, utils_1.InjectManager)()];
            _updateProviderIdentities_decorators = [(0, utils_1.InjectManager)()];
            __esDecorate(_a, null, _createAuthIdentities_decorators, { kind: "method", name: "createAuthIdentities", static: false, private: false, access: { has: function (obj) { return "createAuthIdentities" in obj; }, get: function (obj) { return obj.createAuthIdentities; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateAuthIdentities_decorators, { kind: "method", name: "updateAuthIdentities", static: false, private: false, access: { has: function (obj) { return "updateAuthIdentities" in obj; }, get: function (obj) { return obj.updateAuthIdentities; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createProviderIdentities_decorators, { kind: "method", name: "createProviderIdentities", static: false, private: false, access: { has: function (obj) { return "createProviderIdentities" in obj; }, get: function (obj) { return obj.createProviderIdentities; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateProviderIdentities_decorators, { kind: "method", name: "updateProviderIdentities", static: false, private: false, access: { has: function (obj) { return "updateProviderIdentities" in obj; }, get: function (obj) { return obj.updateProviderIdentities; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.default = AuthModuleService;
