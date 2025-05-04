import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

const API_PORT = process.env.NEST_PORT || 3001;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors();
    await app.listen(API_PORT);
}
bootstrap().then(() => {
    console.log(`Server is running on http://localhost:${API_PORT}`);
});