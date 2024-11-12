import { Model, Column, DataType, Table, ForeignKey } from 'sequelize-typescript';
import { Company } from './company';
import {Users} from './users'
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { UserValuesType } from '../types/user_valuestypes';
@ObjectType()
@Table({
    tableName: 'data',
    timestamps: false
})
export class User extends Model {
    @Field(type=>Int)
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id!: number;

    @Field()
    @Column({
        type: DataType.STRING
    })
    name!: string;

    @Field(type=>Int)
    @ForeignKey(()=> Users)
    @Column({
        type:DataType.INTEGER
    })
    main_id!:number;

    @Field(type=>Int)
    @Column({
        type: DataType.INTEGER
    })
    age!: number;

    @Field()
    @Column({
        type: DataType.STRING
    })
    hobby!: string;

    @Field(type=>Int)
    @ForeignKey(() => Company)
    @Column({
        type: DataType.INTEGER
    })
    company_id!: number;

    @Field(type=>[String])
    @Column({
        type: DataType.STRING,
    })
    column_values?: string[];
    @Field(type => [UserValuesType], { nullable: true })
    additionalValues?: UserValuesType[];
}
