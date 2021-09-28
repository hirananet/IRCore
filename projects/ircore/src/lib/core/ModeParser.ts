export class ModeParser {

  public static parse(rawMessage: string) {
    let modeRaw = rawMessage.split(' MODE ')[1];
    if(modeRaw.indexOf('#') == -1) {
      const modeCut = modeRaw.split(':');
      const regex = /(\\+|\-)?([a-zA-Z]+)/.exec(modeCut[1]);
      return [
        undefined,
        regex[1], // + o -
        regex[2].trim(), // modo
        modeCut[0].trim() // usuario
      ];
    } else {
      const regOut = /#([a-zA-Z0-9_#]+)\s(\+|\-)?([a-zA-Z]+)\s\:?([a-zA-Z_][a-zA-Z0-9_]+)/.exec(modeRaw);
      if(regOut) {
        return [
          undefined,
          regOut[2],
          regOut[3].trim(),
          regOut[4]
        ];
      } else {
        // modo de canal?
        const modos = modeRaw.split(':');
        return [
          undefined,
          undefined,
          modos[1],
          undefined
        ]
      }
    }
  }

}
