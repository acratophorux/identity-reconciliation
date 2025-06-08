import { DataSource } from "typeorm";
import { Contact } from "../src/entities/contact.entity";

export const AppTestDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'identity_recon_test',
    synchronize: true,
    dropSchema: true, 
    logging: false,
    entities: [Contact],
});