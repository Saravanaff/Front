import { createPubSub } from "@graphql-yoga/subscription";
import {Message} from '../types/Chat';
export const pubSub = createPubSub<{
  MESSAGE_ADDED: [Message];
}>();
