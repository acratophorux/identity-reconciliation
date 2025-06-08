import {Request, Response} from 'express';
import { identifyContact } from '../services/identify.service';
import { AppDataSource } from '../data-source';
import { Contact } from '../entities/contact.entity';
export const identifyController = async (req: Request, res:Response)=>{
    try {
        const repo = AppDataSource.getRepository(Contact);
        const result = await identifyContact(repo, req.body);        
        res.status(200).json(result);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
};