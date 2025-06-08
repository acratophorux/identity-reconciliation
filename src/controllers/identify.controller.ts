import {Request, Response} from 'express';
export const identifyController = async (req: Request, res:Response)=>{
    res.json({message:'identify endpoint here'});
};