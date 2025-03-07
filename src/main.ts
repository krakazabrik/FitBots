import mineflayer from "mineflayer";
import webInventory from "mineflayer-web-inventory";
import input from "input";
import readline from "readline";
import { Inventory } from "./modules/inventory.ts";
import { chatUtils } from "./modules/chatUtils.ts";
import { scripts } from "./modules/scripts.ts";

class Main {
    private static bot: mineflayer.Bot;
    private static nick: string;

    public static async getNick() {
        Main.nick = await input.text("nick: ");
        Main.nick.toString()
    }

    public static async main() {
        await Main.getNick()
        console.log("nick: " + Main.nick);

        const botOptions = {
            host: "mc.spookytime.net",
            username: Main.nick,
            version: "1.18.2",
            port: 25565
        };

        Main.bot = mineflayer.createBot(botOptions);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const InventoryModule = new Inventory(Main.bot);
        const scriptsModule = new scripts(Main.bot);

        Main.bot.once('spawn', () => {
            webInventory(this.bot, {port: 3000});
            InventoryModule.startInventory()
        });

        setInterval(() => {
            InventoryModule.sortItems()
        }, 60000);

        Main.bot.on("chat", (username: string, message: string) => {

        });


        Main.bot.on('message', (_jsonMsg: object) => {
            const serverMessage = _jsonMsg.toString()
            if(serverMessage.includes('[☃] У Вас купили')) {
                InventoryModule.autoSell();
            }
            console.log(serverMessage);
            const ChatModule = new chatUtils(Main.bot);
            ChatModule.autoPay(_jsonMsg, "AutSideer");
        });

        Main.bot.on("windowOpen", (window: any) => {
            console.log(window.title);
        });

        rl.on('line', (input: string) => {
            Main.bot.chat(input);

            if(input == '/sell') {
                try {
                    InventoryModule.sellItems()
                } catch (error) {
                    console.log(error);
                }
            }

            if(input == "/re") {
                try {
                    scriptsModule.refreshItems()
                } catch(error) {
                    console.log(error)
                }
            }
              
    
            
          }); 
    };
};


Main.main()
