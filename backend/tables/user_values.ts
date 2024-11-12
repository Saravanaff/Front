import { Model, Column, DataType, Table, ForeignKey } from 'sequelize-typescript';
import { User } from './user';
import {Users} from './users'
import { Company } from './company';

@Table({
    tableName: 'data_values',
    timestamps: false
})
export class UserValues extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    user_id!: number;

    @Column({
        type: DataType.STRING
    })
    keys!: string;

    @Column({
        type: DataType.STRING
    })
    values!: string;

    @ForeignKey(()=>Users)
    @Column({
        type:DataType.INTEGER
    })
    main_id!:number
    
    @ForeignKey(()=>Company)
    @Column({
        type:DataType.INTEGER,
        allowNull:false
    })
    company_id!:number

}
