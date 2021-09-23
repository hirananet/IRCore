import { RawMessage } from './../domain/rawMessage';
export class IRCParserV3 {

  public process(raw: string) {
    const rawMessage = new RawMessage(raw);

  }

}
