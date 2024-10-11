import {
  MedicalHistory,
  UserVaccineData,
  UserMedicineData,
} from "src/core/medical-history/entities";
import { registerAs } from "@nestjs/config";
import { User } from "src/core/user/entities";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vaccine } from "src/core/vaccine/entities";
import { Medicine } from "src/core/medicine/entities";

export default registerAs(
  "database",
  (): TypeOrmModule => ({
    type: "postgres",
    host: process.env.DB_HOST || "",
    port: +process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "",
    logging: process.env.LOGGING || false,
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    synchronize: false,
    dropSchema: false,
    entities: [User, Medicine, Vaccine, MedicalHistory, UserVaccineData, UserMedicineData],
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
);
