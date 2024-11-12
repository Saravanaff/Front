import {  Model, Column, DataType, Table, ForeignKey } from 'sequelize-typescript';
@Table({
    tableName: 'user',
    timestamps: false
})
class User extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true
    })
    id!: number;

    @Column({
        type: DataType.STRING
    })
    name!: string;

    @Column({
        type: DataType.INTEGER
    })
    age!: number;

    @Column({
        type: DataType.STRING
    })
    hobby!: string;

    @ForeignKey(() => Company)   @Column({
        type: DataType.INTEGER
    })
    company_id!: number;

    @Column({
        type: DataType.JSON,
        defaultValue: {}
    })
    column_values?: { [key: string]: any };
}