import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
export class UserValuesType {
    @Field(type => ID)
    id!: number;

    @Field(type => Int)
    user_id!: number;

    @Field()
    keys!: string;

    @Field()
    values!: string;
}
