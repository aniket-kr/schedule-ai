import {
    ClassSerializerInterceptor,
    Logger,
    ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const serializerInterceptor = new ClassSerializerInterceptor(
        app.get(Reflector),
        { strategy: 'excludeAll' },
    );
    app.useGlobalInterceptors(serializerInterceptor);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    const config = app.get(ConfigService);
    const { host, port } = config.app;
    await app.listen(port, host);
    Logger.log(`Server listening on http://${host}:${port}`, 'AppBootstrap');
}
bootstrap();
