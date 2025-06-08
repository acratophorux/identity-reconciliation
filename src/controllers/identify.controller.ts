import {Request, Response} from 'express';
import { identifyContact } from '../services/identify.service';
export const identifyController = async (req: Request, res:Response)=>{
    try {
        const result = await identifyContact(req.body);
        res.status(200).json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
};