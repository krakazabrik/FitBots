import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path, { resolve } from "path";

export class Inventory {
    private static app: express.Application = express();
    private static PORT: number = 3001;
    private static server: any = createServer(Inventory.app); 
    private static io: any = new Server(Inventory.server);
    private bot: any;
    private static minPrice: number = 9_000_000;
    private static maxPrice: number = 10_000_000;
    private static price: number = Math.floor(Math.random() * (Inventory.maxPrice - Inventory.minPrice + 1)) + Inventory.minPrice;

    constructor(bot: any) {
        this.bot = bot;
    }

    public startInventory() {
        Inventory.app.use(express.static(path.join('public')));
        
        Inventory.app.get('/', (req, res) => {
            res.sendFile(path.join('/home/hatethemoon/Documents/GitHub/farmbot/public/index.html'));
        });
        Inventory.server.listen(Inventory.PORT, () => {
            console.log(`Clicker running`);
        });

        Inventory.io.on("connection", (socket) => {
            socket.on('clickSlot', (slot: number) => {
                this.bot.clickWindow(slot, 0, 0);
            });

            socket.on('hotbarClick', (slot: number) => {
                this.bot.setQuickBarSlot(slot, 0, 0);
            })
        });
    };

    public async sellItems() {
        await new Promise(resolve => setTimeout(resolve, 1000));
            for (let i = 0; i < 9; i++) {
                setTimeout(() => {
                    this.bot.setQuickBarSlot(i);
                    this.bot.chat(`/ah sell ${Inventory.price}`);
                    console.log(`продан предмет из слота ${i}`)
                }, 1000)
       
            }

    }

    public autoSell() {
        // слоты в инвентаре 36-44
        // слоты с аукционом 81-89
            for(let i: number = 0; i < 9; i++) {
                this.bot.setQuickBarSlot(i)
                const item = this.bot.inventory.slots[i];
                if(item) {
                    console.log(item.name);
                    this.bot.chat(`ah sell ${Inventory.price}`);
                    return;
                } else {
                    console.log("пустой слот");
                };
            }
    }

    public sortItems() {
        if(!this.bot.inventory) {
            console.log('no inventory');
            return;
        };

        const inv: any = this.bot.inventory.slots;
        console.log(inv);
    }
}
