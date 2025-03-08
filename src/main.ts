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
    private static WebInventoryPort: string;

    public static async getNick() {
        Main.nick = await input.text("nick: ");
    }

    public static async getWebInventoryPort() {
        console.log("Ожидание ввода порта...");
        Main.WebInventoryPort = await input.text("web inventory port: ");
        console.log("web inventory port: " + Main.WebInventoryPort)
        // if(!Main.WebInventoryPort) {
        //     console.log('web server is runing on default port 3001.');
        // }
        // if(Main.WebInventoryPort.lenght != 4) {
        //     console.log('inventory port must me 4 charts');
        //     return;
        // }
    }

    public static async main() {
        await Main.getNick()
        await Main.getWebInventoryPort()
        console.log("nick: " + Main.nick);
        console.log("web inventory port: " + Main.WebInventoryPort)

        const botOptions = {
            host: "mc.spookytime.net",
            username: Main.nick,
            version: "1.18.2",
            port: 25565
        }

        Main.bot = mineflayer.createBot(botOptions);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const InventoryModule = new Inventory(Main.bot);
        const scriptsModule = new scripts(Main.bot);

        Main.bot.once('spawn', () => {
            webInventory(Main.bot, {port: 3001});
            InventoryModule.startInventory()
        });

        setInterval(() => {
            InventoryModule.sortItems()
        }, 60000);

        Main.bot.on("chat", (username: string, message: string) => {

        });


        Main.bot.on('message', (_jsonMsg: object) => {
            const serverMessage = _jsonMsg.toString()
            if(serverMessage.includes('[☃] У Вас куили')) {
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
