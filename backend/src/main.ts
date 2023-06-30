require('dotenv').config();

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
	origin: ["http://localhost", "http://localhost:4242", process.env.FRONTEND_HOST, process.env.BACKEND_HOST],
	methods: ["GET", "POST"]
  });

  await app.listen(3000);
}
bootstrap(); 
