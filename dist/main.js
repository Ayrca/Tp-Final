"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    console.log("FRONTEND_URL desde Railway:", process.env.FRONTEND_URL);
    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Server running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map