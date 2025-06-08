import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, 
    ManyToOne, OneToMany
} from 'typeorm';

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({type:'text', nullable:true})
    phoneNumber?:string;
    @Column({type:'text', nullable:true})
    email?: string;
    @ManyToOne(()=>Contact, contact => contact.secondaryContacts, {nullable:true})
    linkedContact?:Contact;
    @OneToMany(()=>Contact, contact => contact.linkedContact)
    secondaryContacts?:Contact[];
    @Column({type:'varchar', length:10, })
    linkPrecedence!: 'primary' | 'secondary';
    @CreateDateColumn()
    createdAt!: Date;
    @UpdateDateColumn()
    updatedAt!:Date;
    @DeleteDateColumn()
    deletedAt?:Date;
}