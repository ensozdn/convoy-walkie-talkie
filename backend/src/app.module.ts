import { Module } from "@nestjs/common";
import { TokenController } from "./token.controller";
import { EventsGateway } from "./events.gateway";

@Module({
  imports: [],
  controllers: [TokenController],
  providers: [EventsGateway],
})
export class AppModule {}
