import { ObjectType, Field, ID,Int} from 'type-graphql';

@ObjectType()
export class CompanyType {
    @Field(type => ID)
    id!: number;

    @Field()
    company_name!: string;

    @Field(type => String,{nullable:true})
    column_name?: string;

    @Field(type=>Int)
    main_id?:number
}
