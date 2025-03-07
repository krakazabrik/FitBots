export class chatUtils {
    private bot: any;

    constructor(bot: any) {
        this.bot = bot;
    }

    public autoPay(jsonMsg, master: string) {
            // [$] Ваш баланс: $1,932.94
            // [$] $100,000 получено от игрока Eboyret
            // [☃] У Вас купили Алмазный меч за $2,000 на /ah
        const serverMessage = jsonMsg.toString();
        if(serverMessage.includes("получено от игрока") || serverMessage.includes('[☃] У Вас купили')) {
            this.bot.chat('/balance');
        }
        
        if(serverMessage.includes("[$] Ваш баланс: $")) {
            let getBalance = serverMessage.split(" ");
            let splitedBalance = getBalance[3];
            let clearBalance = splitedBalance.replace(/[$,]/g, "");
            let numBalance = Number(clearBalance);

        if(numBalance < 2_000_000) {
            console.log('ты бомж');
            return;
            } else {
             console.log(Math.round(numBalance));
             this.bot.chat(`/pay ${master} ${numBalance}`);
                setTimeout(() => {
                    this.bot.chat(`/pay ${master} ${numBalance}`);
                }, 2000);

                };
            }
    }
}
