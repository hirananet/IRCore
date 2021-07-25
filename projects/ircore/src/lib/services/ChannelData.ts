import { AvatarHelper } from './../helpers/avatar.helper';
import { MessageWithMetadata } from './../utils/PostProcessor';
import { User } from '../dto/User';

export class ChannelData {
  name: string;
  topic: string;
  users: User[] = [];
  messages: GenericMessage[] = [];
}

export class GenericMessage {
  message: string;
  author?: Author<User | string>;
  date: string;
  special: boolean; // for actions "me"
  notify?: boolean; // for server message
  quote?: Quote;

  // post-loaded
  messageWithMetadata?: MessageWithMetadata;
  target?: string; // nombre del chat o conversación
  fromHistory?: boolean;
  externalNotice: boolean = false;
}

export class Quote {
  author: string | User;
  quote: string;
}

export class Author<t> {
  user: t;
  image: string;

  constructor(user: t) {
    let imageURL = AvatarHelper.getAvatarURL();
    if(typeof user == 'string') {
      this.image = imageURL + user;
    } else {
      this.image = imageURL + (user as any).nick;
    }
    this.user = user;
  }
}
