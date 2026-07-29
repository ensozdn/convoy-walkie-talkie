import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

// .env dosyasını yükle
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  // CORS ayarı - Expo Go'dan gelecek isteklere izin ver
  app.enableCors({
    origin: '*',
    methods: 'GET,POST',
  });

  // Ses base64 upload icin body limit artir (varsayilan 100kb yetersiz, ses ~200kb)
  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ limit: '10mb', extended: true }));

  await app.listen(3000);
  console.log('Konvoy Telsiz Backend calisiyor: http://localhost:3000');
}
bootstrap();
