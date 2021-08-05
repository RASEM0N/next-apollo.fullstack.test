"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: '.env',
});
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const main = async () => {
    const orm = await core_1.MikroORM.init(mikro_orm_config_1.default);
    const isConnected = await orm.isConnected();
    console.log(`CONNECTED --${isConnected}--`);
    await orm.getMigrator().up();
};
main().catch((e) => {
    console.error(e);
});
//# sourceMappingURL=index.js.map