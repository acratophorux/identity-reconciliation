import express from 'express';
import { AppDataSource } from './data-source';
import identifyRouter from './routes/identify.route';

const app = express();
app.use(express.json());
app.use('/identify', indentifyRouter);

AppDataSource.initialize().then(
    ()=>{
        console.log('Data source initialized');
        app.listen(3000, ()=>{
            console.log('Server is running on port 3000');
        })
    }
).catch((err) => {
    console.log('Error during data source initialization', err);
});