import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Contact } from './entities/contact.entity';

export const AppDataSource = new DataSource(
    {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'identity_recon',
        synchronize: true,
        logging: false,
        entities: [Contact],
    }
);