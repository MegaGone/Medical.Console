import { Module } from "@nestjs/common";
import { User } from "../user/entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PatientService } from "./patient.service";
import { SharedModule } from "../shared/shared.module";
import { PatientController } from "./patient.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
