import { ObjectType, Field, ID, Int } from 'type-graphql';
import { CompanyType } from '../types/companytypes';
import { UserValuesType } from '../types/user_valuestypes';

@ObjectType()
export class UserType {
    @Field(type => ID)
    id!: number;

    @Field()
    name!: string;

    @Field(type => Int)
    age!: number;

    @Field()
    hobby!: string;

    @Field(type => Int)
    company_id!: number;

    @Field(type => CompanyType, { nullable: true })
    company?: CompanyType;

    @Field(type => [UserValuesType], { nullable: true })
    additionalValues?: UserValuesType[];

    @Field(type =>[String], { nullable: true })
    column_values?:string[];
}

