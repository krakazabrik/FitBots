export class scripts {
    private bot: any;
    
    constructor(bot: any) {
        this.bot = bot;
    }

    public async refreshItems() {
        try {
            this.bot.clickWindow(52, 0, 0)
            setInterval(() => {
                this.bot.clickWindow(52, 0, 0);
            }, 61000);
        } catch(error) {
            console.log(error)
        }
  
    }
}