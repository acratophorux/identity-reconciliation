import express from 'express';
import { AppDataSource } from './data-source';
import identifyRouter from './routes/identify.route';

const app = express();
app.use(express.json());
app.use('/identify', identifyRouter);

const port = process.env.PORT || 3000 
AppDataSource.initialize().then(
    ()=>{
        console.log('Data source initialized');
        app.listen(port, ()=>{
            console.log(`App listening on port ${port}`);
        })
    }
).catch((err) => {
    console.log('Error during data source initialization', err);
});