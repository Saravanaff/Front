import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  user: string;
}
