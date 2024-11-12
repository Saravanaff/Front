import { Model, Column, DataType, Table, ForeignKey, AutoIncrement, PrimaryKey, AllowNull } from 'sequelize-typescript';
import { Company } from './company';

@Table({
    tableName: 'users',
    timestamps: false
})
export class Users extends Model {
    @Column({
        type:DataType.INTEGER,
        autoIncrement:true,
        primaryKey:true
    })
    id!: number;

    @Column({
        type:DataType.STRING
    })
    name?:string;
    
    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    email!:string;

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    password!:string
}