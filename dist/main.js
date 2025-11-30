"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    try {
        app.enableCors({
            origin: process.env.FRONTEND_URL,
            credentials: true,
        });
        const port = process.env.PORT || 3000;
        await app.listen(port);
        console.log(`Server running on port ${port}`);
    }
    catch (error) {
        console.error('🔥 ERROR AL INICIAR NESTJS 🔥');
        console.error(error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map