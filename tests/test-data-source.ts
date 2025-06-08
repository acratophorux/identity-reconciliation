import { DataSource } from "typeorm";
import { Contact } from "../src/entities/contact.entity";
import * as dotenv from "dotenv";
dotenv.config();
export const AppTestDataSource = new DataSource({
    type: 'postgres',
    url:process.env.DATABASE_URL,
    synchronize: true,
    dropSchema: true, 
    logging: false,
    entities: [Contact],
});