import { registerAs } from '@nestjs/config';
import { User } from 'src/core/user/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModule => ({
    type: 'postgres',
    host: process.env.DB_HOST || '',
    port: +process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || '',
    logging: process.env.LOGGING || false,
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    synchronize: false,
    dropSchema: false,
    entities: [User],
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
);
