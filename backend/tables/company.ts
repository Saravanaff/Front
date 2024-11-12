import { Model, Column, DataType, Table } from 'sequelize-typescript';
import { Col } from 'sequelize/types/utils';

@Table({
    tableName: "company",
    timestamps: false
})
export class Company extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id!: number;

    @Column({
        type: DataType.STRING
    })
    company_name!: string;

    @Column({
        type: DataType.STRING,
    })
    column_name?: string;
    
    @Column({
        type:DataType.INTEGER
    })
    main_id!:number
}
