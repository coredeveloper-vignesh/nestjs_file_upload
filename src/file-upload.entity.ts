/* eslint-disable prettier/prettier */
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ database: 'file_upload', name: 'file_upload_details' })
export class FileUpload extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    user_id: number;
    @Column()
    customer_id: string;
    @Column()
    image_name: string;
  
}
