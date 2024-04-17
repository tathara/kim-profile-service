import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from '@config';

async function bootstrap() {
  const server = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('KIM Profile service')
    .setDescription('CFUV KIM Profile service')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(server, config);
  SwaggerModule.setup('/api/docs', server, document);

  return server.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
}

bootstrap();
