import { Resolver, Query, Mutation, Arg, Subscription, Root, PubSub } from 'type-graphql';
import { Message } from '../types/Chat';
import { pubSub } from './pubsub';

@Resolver()
class MessageResolver {
  private messages: Message[] = [];

  @Query(() => [Message])
  getMessages() {
    return this.messages;
  }

  @Mutation(() => Message)
  async addMessage(
    @Arg('content') content: string,
    @Arg('user') user: string
  ): Promise<Message> {
    const message = { id: Date.now().toString(), content, user };
    this.messages.push(message);

    await pubSub.publish('MESSAGE_ADDED', message);
    return message;
  }

  @Subscription(() => Message, {
    topics: 'MESSAGE_ADDED',
  })
  messageAdded(@Root() message: Message): Message {
    return message;
  }
}

export { MessageResolver };
