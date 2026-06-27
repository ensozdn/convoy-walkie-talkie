import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

// .env dosyasını yükle
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS ayarı - Expo Go'dan gelecek isteklere izin ver
  app.enableCors({
    origin: "*", // Geliştirme için - production'da belirli origin'leri belirtin
    methods: "GET,POST",
  });

  await app.listen(3000);
  console.log("🚗 Konvoy Telsiz Backend çalışıyor: http://localhost:3000");
}
bootstrap();
