import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
export class UsersSign{
    @Field(type=>String)
    name?:string;
    @Field(type=>String)
    email!:string
    @Field(type=>String)
    password!:string
    @Field({nullable:true})
    token?:string;
}
