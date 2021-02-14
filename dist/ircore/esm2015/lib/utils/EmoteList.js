export class EmoteList {
    static getMeme(name, author) {
        if (this.memes.findIndex(meme => meme === name) >= 0) {
            return this.memesLocation + name + this.memesExtension;
        }
        else {
            return undefined;
        }
    }
    static getFace(name, author) {
        if (this.faces.findIndex(meme => meme === name) >= 0) {
            return this.facesLocation + name + this.facesExtension;
        }
        else if (this.specialFaces[author] &&
            this.specialFaces[author].findIndex(meme => meme === name) >= 0) {
            return this.specialLocation + name + this.facesExtension;
        }
        else if (author === 'Gabriela-') {
            if (name === 'magia') {
                startEventEffect();
            }
            if (name === 'primavera') {
                startEventEffectPrimavera();
            }
            if (name === 'verano') {
                startEventEffectVerano();
            }
            if (name === 'otono') {
                startEventEffectOtono();
            }
            if (name === 'cabritas') {
                startEventEffectCabritas();
            }
            if (name === 'regalos') {
                startEventEffectRegalo();
            }
            if (name === 'lluvia') {
                startEventEffectMeteor();
            }
            if (name === 'kz2') {
                startEventEffectKz2s();
            }
            return undefined;
        }
        else if (author === 'Alex' || author === 'Tulkalex' || author === 'Tulkalen') {
            if (name === 'kz2') {
                startEventEffectKz2s(); // Probando
            }
            return undefined;
        }
        else {
            return undefined;
        }
    }
}
EmoteList.facesLocation = 'assets/faces/';
EmoteList.specialLocation = 'assets/specials/';
EmoteList.facesExtension = '.png';
EmoteList.memesLocation = 'assets/em-mem/';
EmoteList.memesExtension = '';
EmoteList.specialFaces = {
    'Gabriela-': [
        'regla',
        'magico',
        'stamp'
    ],
    Polsaker: [
        'stamp'
    ]
};
EmoteList.faces = [
    'aaa',
    'break',
    'chaky',
    'challenge',
    'cry',
    'ehh',
    'facepalm',
    'fap',
    'fffpf',
    'fu',
    'fuckyeah',
    'genius',
    'hmmm',
    'hpm',
    'jij',
    'laugh',
    'LOL',
    'magicBook',
    'magicCircle',
    'magicDrug',
    'magichat',
    'no',
    'oka',
    'rage',
    'siuu',
    'sparkle',
    'stickmagic',
    'stickmagic2',
    'trollface',
    'mog',
    'why',
    'WitchHat',
    'why',
    'yao',
    'true',
    'amazing',
    'forever',
    'notbad',
    'brindis',
    'buttcoin',
    'cigar',
    'cigar2',
    'coffee',
    'coffee2',
    'coffee3',
    'goatman',
    'hacker',
    'service',
    'stick',
    'wine',
    'wineBottle',
    'escoba',
    'principito',
    'baskerville',
    'cumple',
    'cumple2',
    'abrazo',
    'agua1',
    'agua2',
    'angry',
    'barco',
    'eagle',
    'fatcat',
    'fox',
    'handshake',
    'kiss',
    'rose',
    'tarta',
    'te',
    'whisky',
    'zumo',
    'burger',
    'candy',
    'caniche',
    'celtic',
    'coca',
    'editorial',
    'gaviota',
    'goat',
    'icecream',
    'listado',
    'magicwind',
    'medal',
    'musical',
    'palette',
    'pizza',
    'podium',
    'batido',
    'fresas',
    'wizard',
    'xane'
];
EmoteList.memes = [
    'baneo',
    'baneo2',
    'baneo3',
    'buscar',
    'buscar2',
    'comunicacion',
    'despedida',
    'expulsar',
    'hacker',
    'hacker2',
    'hacker3',
    'hacker4',
    'hacker5',
    'hacker6',
    'hacker7',
    'hacker8',
    'hacker9',
    'hacker10',
    'hacker11',
    'hacker12',
    'impuestos',
    'impuestos2',
    'llegada',
    'magia',
    'magia2',
    'magia3',
    'magia4',
    'magia5',
    'magia6',
    'nopreguntas',
    'nopreguntas2',
    'topic',
    'topic2'
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1vdGVMaXN0LmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL2FsZXhhL2dpdC9JUkNvcmUvcHJvamVjdHMvaXJjb3JlL3NyYy8iLCJzb3VyY2VzIjpbImxpYi91dGlscy9FbW90ZUxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsTUFBTSxPQUFPLFNBQVM7SUFxSmIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFZLEVBQUUsTUFBYztRQUNoRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwRCxPQUFPLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDeEQ7YUFBTTtZQUNMLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztJQUVNLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBWSxFQUFFLE1BQWM7UUFDaEQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDcEQsT0FBTyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQ3hEO2FBQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDMUUsT0FBTyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQzFEO2FBQU0sSUFBSSxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQ2pDLElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtn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QUNULE9BQU87SUFDUCxRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsTUFBTTtDQUNQLENBQUM7QUFFcUIsZUFBSyxHQUFHO0lBQzdCLE9BQU87SUFDUCxRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixTQUFTO0lBQ1QsY0FBYztJQUNkLFdBQVc7SUFDWCxVQUFVO0lBQ1YsUUFBUTtJQUNSLFNBQVM7SUFDVCxTQUFTO0lBQ1QsU0FBUztJQUNULFNBQVM7SUFDVCxTQUFTO0lBQ1QsU0FBUztJQUNULFNBQVM7SUFDVCxTQUFTO0lBQ1QsVUFBVTtJQUNWLFVBQVU7SUFDVixVQUFVO0lBQ1YsV0FBVztJQUNYLFlBQVk7SUFDWixTQUFTO0lBQ1QsT0FBTztJQUNQLFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsYUFBYTtJQUNiLGNBQWM7SUFDZCxPQUFPO0lBQ1AsUUFBUTtDQUNULENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBzdGFydEV2ZW50RWZmZWN0OiBhbnk7XG5kZWNsYXJlIHZhciBzdGFydEV2ZW50RWZmZWN0UmVnYWxvOiBhbnk7XG5kZWNsYXJlIHZhciBzdGFydEV2ZW50RWZmZWN0TWV0ZW9yOiBhbnk7XG5kZWNsYXJlIHZhciBzdGFydEV2ZW50RWZmZWN0Q2Ficml0YXM6IGFueTtcbmRlY2xhcmUgdmFyIHN0YXJ0RXZlbnRFZmZlY3RQcmltYXZlcmE6IGFueTtcbmRlY2xhcmUgdmFyIHN0YXJ0RXZlbnRFZmZlY3RWZXJhbm86IGFueTtcbmRlY2xhcmUgdmFyIHN0YXJ0RXZlbnRFZmZlY3RPdG9ubzogYW55O1xuZGVjbGFyZSB2YXIgc3RhcnRFdmVudEVmZmVjdEt6MnM6IGFueTtcblxuZXhwb3J0IGNsYXNzIEVtb3RlTGlzdCB7XG5cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBmYWNlc0xvY2F0aW9uID0gJ2Fzc2V0cy9mYWNlcy8nO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHNwZWNpYWxMb2NhdGlvbiA9ICdhc3NldHMvc3BlY2lhbHMvJztcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBmYWNlc0V4dGVuc2lvbiA9ICcucG5nJztcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBtZW1lc0xvY2F0aW9uID0gJ2Fzc2V0cy9lbS1tZW0vJztcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBtZW1lc0V4dGVuc2lvbiA9ICcnO1xuXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgc3BlY2lhbEZhY2VzID0ge1xuICAgICdHYWJyaWVsYS0nOiBbXG4gICAgICAncmVnbGEnLFxuICAgICAgJ21hZ2ljbycsXG4gICAgICAnc3RhbXAnXG4gICAgXSxcbiAgICBQb2xzYWtlcjogW1xuICAgICAgJ3N0YW1wJ1xuICAgIF1cbiAgfTtcblxuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IGZhY2VzID0gW1xuICAgICdhYWEnLFxuICAgICdicmVhaycsXG4gICAgJ2NoYWt5JyxcbiAgICAnY2hhbGxlbmdlJyxcbiAgICAnY3J5JyxcbiAgICAnZWhoJyxcbiAgICAnZmFjZXBhbG0nLFxuICAgICdmYXAnLFxuICAgICdmZmZwZicsXG4gICAgJ2Z1JyxcbiAgICAnZnVja3llYWgnLFxuICAgICdnZW5pdXMnLFxuICAgICdobW1tJyxcbiAgICAnaHBtJyxcbiAgICAnamlqJyxcbiAgICAnbGF1Z2gnLFxuICAgICdMT0wnLFxuICAgICdtYWdpY0Jvb2snLFxuICAgICdtYWdpY0NpcmNsZScsXG4gICAgJ21hZ2ljRHJ1ZycsXG4gICAgJ21hZ2ljaGF0JyxcbiAgICAnbm8nLFxuICAgICdva2EnLFxuICAgICdyYWdlJyxcbiAgICAnc2l1dScsXG4gICAgJ3NwYXJrbGUnLFxuICAgICdzdGlja21hZ2ljJyxcbiAgICAnc3RpY2ttYWdpYzInLFxuICAgICd0cm9sbGZhY2UnLFxuICAgICdtb2cnLFxuICAgICd3aHknLFxuICAgICdXaXRjaEhhdCcsXG4gICAgJ3doeScsXG4gICAgJ3lhbycsXG4gICAgJ3RydWUnLFxuICAgICdhbWF6aW5nJyxcbiAgICAnZm9yZXZlcicsXG4gICAgJ25vdGJhZCcsXG4gICAgJ2JyaW5kaXMnLFxuICAgICdidXR0Y29pbicsXG4gICAgJ2NpZ2FyJyxcbiAgICAnY2lnYXIyJyxcbiAgICAnY29mZmVlJyxcbiAgICAnY29mZmVlMicsXG4gICAgJ2NvZmZlZTMnLFxuICAgICdnb2F0bWFuJyxcbiAgICAnaGFja2VyJyxcbiAgICAnc2VydmljZScsXG4gICAgJ3N0aWNrJyxcbiAgICAnd2luZScsXG4gICAgJ3dpbmVCb3R0bGUnLFxuICAgICdlc2NvYmEnLFxuICAgICdwcmluY2lwaXRvJyxcbiAgICAnYmFza2VydmlsbGUnLFxuICAgICdjdW1wbGUnLFxuICAgICdjdW1wbGUyJyxcbiAgICAnYWJyYXpvJyxcbiAgICAnYWd1YTEnLFxuICAgICdhZ3VhMicsXG4gICAgJ2FuZ3J5JyxcbiAgICAnYmFyY28nLFxuICAgICdlYWdsZScsXG4gICAgJ2ZhdGNhdCcsXG4gICAgJ2ZveCcsXG4gICAgJ2hhbmRzaGFrZScsXG4gICAgJ2tpc3MnLFxuICAgICdyb3NlJyxcbiAgICAndGFydGEnLFxuICAgICd0ZScsXG4gICAgJ3doaXNreScsXG4gICAgJ3p1bW8nLFxuICAgICdidXJnZXInLFxuICAgICdjYW5keScsXG4gICAgJ2NhbmljaGUnLFxuICAgICdjZWx0aWMnLFxuICAgICdjb2NhJyxcbiAgICAnZWRpdG9yaWFsJyxcbiAgICAnZ2F2aW90YScsXG4gICAgJ2dvYXQnLFxuICAgICdpY2VjcmVhbScsXG4gICAgJ2xpc3RhZG8nLFxuICAgICdtYWdpY3dpbmQnLFxuICAgICdtZWRhbCcsXG4gICAgJ211c2ljYWwnLFxuICAgICdwYWxldHRlJyxcbiAgICAncGl6emEnLFxuICAgICdwb2RpdW0nLFxuICAgICdiYXRpZG8nLFxuICAgICdmcmVzYXMnLFxuICAgICd3aXphcmQnLFxuICAgICd4YW5lJ1xuICBdO1xuXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgbWVtZXMgPSBbXG4gICAgJ2JhbmVvJyxcbiAgICAnYmFuZW8yJyxcbiAgICAnYmFuZW8zJyxcbiAgICAnYnVzY2FyJyxcbiAgICAnYnVzY2FyMicsXG4gICAgJ2NvbXVuaWNhY2lvbicsXG4gICAgJ2Rlc3BlZGlkYScsXG4gICAgJ2V4cHVsc2FyJyxcbiAgICAnaGFja2VyJyxcbiAgICAnaGFja2VyMicsXG4gICAgJ2hhY2tlcjMnLFxuICAgICdoYWNrZXI0JyxcbiAgICAnaGFja2VyNScsXG4gICAgJ2hhY2tlcjYnLFxuICAgICdoYWNrZXI3JyxcbiAgICAnaGFja2VyOCcsXG4gICAgJ2hhY2tlcjknLFxuICAgICdoYWNrZXIxMCcsXG4gICAgJ2hhY2tlcjExJyxcbiAgICAnaGFja2VyMTInLFxuICAgICdpbXB1ZXN0b3MnLFxuICAgICdpbXB1ZXN0b3MyJyxcbiAgICAnbGxlZ2FkYScsXG4gICAgJ21hZ2lhJyxcbiAgICAnbWFnaWEyJyxcbiAgICAnbWFnaWEzJyxcbiAgICAnbWFnaWE0JyxcbiAgICAnbWFnaWE1JyxcbiAgICAnbWFnaWE2JyxcbiAgICAnbm9wcmVndW50YXMnLFxuICAgICdub3ByZWd1bnRhczInLFxuICAgICd0b3BpYycsXG4gICAgJ3RvcGljMidcbiAgXTtcblxuICBwdWJsaWMgc3RhdGljIGdldE1lbWUobmFtZTogc3RyaW5nLCBhdXRob3I6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMubWVtZXMuZmluZEluZGV4KG1lbWUgPT4gbWVtZSA9PT0gbmFtZSkgPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMubWVtZXNMb2NhdGlvbiArIG5hbWUgKyB0aGlzLm1lbWVzRXh0ZW5zaW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0RmFjZShuYW1lOiBzdHJpbmcsIGF1dGhvcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5mYWNlcy5maW5kSW5kZXgobWVtZSA9PiBtZW1lID09PSBuYW1lKSA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5mYWNlc0xvY2F0aW9uICsgbmFtZSArIHRoaXMuZmFjZXNFeHRlbnNpb247XG4gICAgfSBlbHNlIGlmICh0aGlzLnNwZWNpYWxGYWNlc1thdXRob3JdICYmXG4gICAgICAgICAgICAgICB0aGlzLnNwZWNpYWxGYWNlc1thdXRob3JdLmZpbmRJbmRleChtZW1lID0+IG1lbWUgPT09IG5hbWUpID49IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnNwZWNpYWxMb2NhdGlvbiArIG5hbWUgKyB0aGlzLmZhY2VzRXh0ZW5zaW9uO1xuICAgIH0gZWxzZSBpZiAoYXV0aG9yID09PSAnR2FicmllbGEtJykge1xuICAgICAgaWYgKG5hbWUgPT09ICdtYWdpYScpIHtcbiAgICAgICAgc3RhcnRFdmVudEVmZmVjdCgpO1xuICAgICAgfVxuICAgICAgaWYgKG5hbWUgPT09ICdwcmltYXZlcmEnKSB7XG4gICAgICAgIHN0YXJ0RXZlbnRFZmZlY3RQcmltYXZlcmEoKTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lID09PSAndmVyYW5vJykge1xuICAgICAgICBzdGFydEV2ZW50RWZmZWN0VmVyYW5vKCk7XG4gICAgICB9XG4gICAgICBpZiAobmFtZSA9PT0gJ290b25vJykge1xuICAgICAgICBzdGFydEV2ZW50RWZmZWN0T3Rvbm8oKTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lID09PSAnY2Ficml0YXMnKSB7XG4gICAgICAgIHN0YXJ0RXZlbnRFZmZlY3RDYWJyaXRhcygpO1xuICAgICAgfVxuICAgICAgaWYgKG5hbWUgPT09ICdyZWdhbG9zJykge1xuICAgICAgICBzdGFydEV2ZW50RWZmZWN0UmVnYWxvKCk7XG4gICAgICB9XG4gICAgICBpZiAobmFtZSA9PT0gJ2xsdXZpYScpIHtcbiAgICAgICAgc3RhcnRFdmVudEVmZmVjdE1ldGVvcigpO1xuICAgICAgfVxuICAgICAgaWYgKG5hbWUgPT09ICdrejInKSB7XG4gICAgICAgIHN0YXJ0RXZlbnRFZmZlY3RLejJzKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAoYXV0aG9yID09PSAnQWxleCcgfHwgYXV0aG9yID09PSAnVHVsa2FsZXgnIHx8IGF1dGhvciA9PT0gJ1R1bGthbGVuJykge1xuICAgICAgaWYgKG5hbWUgPT09ICdrejInKSB7XG4gICAgICAgIHN0YXJ0RXZlbnRFZmZlY3RLejJzKCk7IC8vIFByb2JhbmRvXG4gICAgICB9XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxufVxuIl19