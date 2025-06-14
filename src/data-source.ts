import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Contact } from './entities/contact.entity';
import * as dotenv from "dotenv";

dotenv.config();
export const AppDataSource = new DataSource(
    {
        type: 'postgres',
        url:process.env.DATABASE_URL,
        synchronize: true,
        logging: false,
        entities: [Contact],
    }
);