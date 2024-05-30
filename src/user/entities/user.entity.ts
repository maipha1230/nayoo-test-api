import { Exclude } from 'class-transformer'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index } from 'typeorm'

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Index('user_email_idx')
    @Column('varchar', {
        length: 150,
        nullable: false,
    })
    email:string
    
    @Column('varchar', {
        length: 255,
        nullable: false,
    })
    @Exclude()
    password: string

    @Column('varchar', {
        name: 'name_th',
        length: 255,
        nullable: false,

    }) 
    nameTh: string

    @Column('varchar', {
        name: 'name_en',
        length: 255,
        nullable: false,

    })
    nameEn: string

    @Column('varchar', {
        name: 'phone',
        length: 255,
        nullable: false,

    })
    phone: string

    @Column('boolean', {
        name: 'is_verify',
        nullable: false,
        default: false
    })
    isVerify: boolean

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: Date
}
