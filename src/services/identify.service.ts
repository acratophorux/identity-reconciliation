import { AppDataSource } from "../data-source";
import { Contact } from "../entities/contact.entity";
import { In } from "typeorm";

interface IdentifyRequest {
    email?: string;
    phoneNumber?: string;
}

export const identifyContact = async ({email, phoneNumber}: IdentifyRequest) =>{
    const contactRepo = AppDataSource.getRepository(Contact);

    // clean up email and phone
    email = email?.trim() || undefined;
    phoneNumber = phoneNumber?.trim() || undefined;

    if(!email && !phoneNumber) throw new Error("At least one of email or phoneNumber must be provided.");


    // find all matching contacts
    const existingContacts = await contactRepo.find({
        where:[
            {email}, {phoneNumber}
        ],
        relations: ['linkedContact', 'secondaryContacts'],
        withDeleted: false,
    });

    //gather all unique contacts primary as well secondary
    const allContacts = new Map<number, Contact>();
    for(const contact of existingContacts){
        if(contact.linkPrecedence ==='primary'){
            allContacts.set(contact.id, contact);
            contact.secondaryContacts?.forEach(sc => allContacts.set(sc.id, sc));
        } else if (contact.linkedContact){
            allContacts.set(contact.linkedContact.id, contact.linkedContact);
            const siblings = await contactRepo.find({
                where: {
                    linkedContact: {id:contact.linkedContact.id}
                },
            });
            siblings.forEach(sib=>allContacts.set(sib.id, sib));
        }
    }

    // if no match found, then create primary contact
    if(allContacts.size === 0){
        const newContact = contactRepo.create({
            email, phoneNumber, linkPrecedence:'primary'
        });
        await contactRepo.save(newContact);
        return formatResponse(newContact, []);
    }
    //find the oldest primary contacct
    const contactsArray = Array.from(allContacts.values());
    const primaries = contactsArray.filter(c => c.linkPrecedence === 'primary');

    const primary = primaries.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    )[0];

    // demote all newer primaries, if any
    const toDemote = primaries.filter(p => p.id !== primary.id);

    for (const contact of toDemote) {
        contact.linkPrecedence = 'secondary';
        contact.linkedContact = primary;
        await contactRepo.save(contact);
    }
    //check whether the user already exists
    const exists = contactsArray.some(c=> {
        return (email && c.email === email )||(phoneNumber && c.phoneNumber === phoneNumber)
        
    });
    
    //update missing values of the user already exists and has empty fields
    if (exists) {
        for (const contact of contactsArray) {
            if (contact.id === primary.id) {
                let updated = false;
                if (!contact.email && email) {
                    contact.email = email;
                    updated = true;
                }
                if (!contact.phoneNumber && phoneNumber) {
                    contact.phoneNumber = phoneNumber;
                    updated = true;
                }
                if (updated) await contactRepo.save(contact);
            }
        }
    }
    
    
    //create new secondary when needed
    let newSecondary: Contact | undefined = undefined;
    if (!exists) {
        newSecondary = contactRepo.create({
            email, phoneNumber, linkPrecedence: 'secondary', linkedContact: primary
        });
        await contactRepo.save(newSecondary);
    }


    const allLinkedContacts = await contactRepo.find({
        where: [{id:primary.id}, {linkedContact: {id: primary.id}}],
        withDeleted: false
    });
    return formatResponse(primary, allLinkedContacts.filter(c=>c.id!==primary.id));
}

const formatResponse = (primary: Contact, secondaries: Contact[])=>{
    const emails = new Set<string>();
    const phoneNumbers = new Set<string>();
    if(primary.email) emails.add(primary.email);
    if(primary.phoneNumber) phoneNumbers.add(primary.phoneNumber);

    secondaries.forEach(c=>{
        if(c.email) emails.add(c.email);
        if(c.phoneNumber) phoneNumbers.add(c.phoneNumber);
    });

    return {
        contact: {
            primaryContactId: primary.id,
            emails: Array.from(emails),
            phoneNumbers: Array.from(phoneNumbers),
            secondaryContactIds: secondaries.map(c=>c.id)
        }
    }

}