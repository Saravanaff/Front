import { InputType, Field, Int, ArgsType,} from 'type-graphql';

@ArgsType()
export class GetUsersArgs {
    @Field({ nullable: true })
    company?: string;
    @Field({nullable:true})
    nam?:string
}

@InputType()
export class CreateUserInput {
    @Field()
    name!: string;

    @Field(type => Int)
    age!: number;

    @Field()
    hobby!: string;

    @Field(type => Int)
    company_id!: number;

    @Field(type => [String])
    pair?: string[];

    @Field(type => [String])
    column_value?: string[];

    @Field({nullable:true})
    nam?:string;
}

@InputType()
export class UpdateUserInput extends CreateUserInput {
    @Field(type => Int)
    id!: number;
}

@InputType()
export class CreateCompanyInput {
    @Field()
    column_name!: string;

    @Field(type => Int)
    company_id!: number;

    @Field()
    nam:string
}
@InputType()
export class UserSign{
    @Field(type=>String)
    name?:string;
    @Field(type=>String)
    email!:string
    @Field(type=>String)
    password!:string
}
@InputType()
export class DelCom{
    @Field()
    company_name!:string

    @Field(type=>Int)
    id?:number

    @Field()
    nam?:string

}
