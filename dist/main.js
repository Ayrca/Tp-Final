"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const frontend = process.env.FRONTEND_URL || '*';
    console.log("🔵 FRONTEND_URL:", frontend);
    app.enableCors({
        origin: frontend,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });
    const port = process.env.PORT || 3000;
    console.log('🔵 PORT env:', process.env.PORT);
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server running on port ${port}`);
    process.on('SIGTERM', () => {
        console.log('⚠️ SIGTERM recibido. Cerrando aplicación...');
        process.exit(0);
    });
    process.on('SIGINT', () => {
        console.log('⚠️ SIGINT recibido. Cerrando aplicación...');
        process.exit(0);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map