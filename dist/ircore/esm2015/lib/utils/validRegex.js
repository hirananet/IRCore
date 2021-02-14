// @dynamic
export class ValidRegex {
    static channelRegex() {
        return '#([a-zA-Z0-9_#]+)';
    }
    static userRegex() {
        return '([a-zA-Z_][a-zA-Z0-9_]+)';
    }
    static actionRegex() {
        return /\x01ACTION ([^\x01]+)\x01/;
    }
    static modeRegex() {
        return '(\\+|\-)?([a-zA-Z]+)';
    }
    static getRegex(regex) {
        return new RegExp(regex);
    }
    static pingRegex(nick) {
        return '^(.*(\\s|,|:))?(' + nick.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')((\\s|,|:).*)?$';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRSZWdleC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9hbGV4YS9naXQvSVJDb3JlL3Byb2plY3RzL2lyY29yZS9zcmMvIiwic291cmNlcyI6WyJsaWIvdXRpbHMvdmFsaWRSZWdleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXO0FBQ1gsTUFBTSxPQUFPLFVBQVU7SUFFZCxNQUFNLENBQUMsWUFBWTtRQUN4QixPQUFPLG1CQUFtQixDQUFDO0lBQzdCLENBQUM7SUFFTSxNQUFNLENBQUMsU0FBUztRQUNyQixPQUFPLDBCQUEwQixDQUFBO0lBQ25DLENBQUM7SUFFTSxNQUFNLENBQUMsV0FBVztRQUN2QixPQUFPLDJCQUEyQixDQUFDO0lBQ3JDLENBQUM7SUFFTSxNQUFNLENBQUMsU0FBUztRQUNyQixPQUFPLHNCQUFzQixDQUFDO0lBQ2hDLENBQUM7SUFFTSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQWE7UUFDbEMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFZO1FBQ2xDLE9BQU8sa0JBQWtCLEdBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsR0FBQyxrQkFBa0IsQ0FBQztJQUMzRixDQUFDO0NBRUYiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZHluYW1pY1xuZXhwb3J0IGNsYXNzIFZhbGlkUmVnZXgge1xuXG4gIHB1YmxpYyBzdGF0aWMgY2hhbm5lbFJlZ2V4KCkge1xuICAgIHJldHVybiAnIyhbYS16QS1aMC05XyNdKyknO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyB1c2VyUmVnZXgoKSB7XG4gICAgcmV0dXJuICcoW2EtekEtWl9dW2EtekEtWjAtOV9dKyknXG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGFjdGlvblJlZ2V4KCkge1xuICAgIHJldHVybiAvXFx4MDFBQ1RJT04gKFteXFx4MDFdKylcXHgwMS87XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1vZGVSZWdleCgpIHtcbiAgICByZXR1cm4gJyhcXFxcK3xcXC0pPyhbYS16QS1aXSspJztcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0UmVnZXgocmVnZXg6IHN0cmluZykge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHJlZ2V4KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgcGluZ1JlZ2V4KG5pY2s6IHN0cmluZykge1xuICAgIHJldHVybiAnXiguKihcXFxcc3wsfDopKT8oJytuaWNrLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJykrJykoKFxcXFxzfCx8OikuKik/JCc7XG4gIH1cblxufVxuIl19