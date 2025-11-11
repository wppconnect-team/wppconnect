/*
 * This file is part of WPPConnect.
 *
 * WPPConnect is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * WPPConnect is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with WPPConnect.  If not, see <https://www.gnu.org/licenses/>.
 */
const wppconnect = require('../../dist');

wppconnect
  .create({
    session: 'test',
    onLoadingScreen: (percent, message) => {
      console.log('LOADING_SCREEN', percent, message);
    },
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  console.log('Starting bot...');
  client.onMessage(async (msg) => {
    try {
      if (msg.body == '!ping') {
        // Send a new message to the same chat
        client.sendText(msg.from, 'pong');
      } else if (msg.body == '!ping reply') {
        // Send a new message as a reply to the current one
        client.reply(msg.from, 'pong', msg.id.toString());
      } else if (msg.body == '!chats') {
        const chats = await client.getAllChats();
        client.sendText(msg.from, `The bot has ${chats.length} chats open.`);
      } else if (msg.body == '!info') {
        let info = await client.getHostDevice();
        let message = `_*Connection info*_\n\n`;
        message += `*User name:* ${info.pushname}\n`;
        message += `*Number:* ${info.wid.user}\n`;
        message += `*Battery:* ${info.battery}\n`;
        message += `*Plugged:* ${info.plugged}\n`;
        message += `*Device Manufacturer:* ${info.phone.device_manufacturer}\n`;
        message += `*WhatsApp version:* ${info.phone.wa_version}\n`;
        client.sendText(msg.from, message);
      } else if (msg.body.startsWith('!sendto ')) {
        // Direct send a new message to specific id
        let number = msg.body.split(' ')[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        client.sendText(number, message);
      } else if (msg.body.startsWith('!pin ')) {
        let option = msg.body.split(' ')[1];
        if (option == 'true') {
          await client.pinChat(msg.from, true);
        } else {
          await client.pinChat(msg.from, false);
        }
      } else if (msg.body.startsWith('!typing ')) {
        const option = msg.body.split(' ')[1];
        if (option == 'true') {
          // Start typing...
          await client.startTyping(msg.from);
        } else {
          // Stop typing
          await client.stopTyping(msg.from);
        }
      } else if (msg.body.startsWith('!ChatState ')) {
        const option = msg.body.split(' ')[1];
        if (option == '1') {
          await client.setChatState(msg.from, '0');
        } else if (option == '2') {
          await client.setChatState(msg.from, '1');
        } else {
          await client.setChatState(msg.from, '2');
        }
      } else if (msg.body.startsWith('!btn')) {
        await client.sendMessageOptions(msg.from, 'test', {
          title: "WOMEN'S JEANS PANTS",
          footer: 'Choose an option below',
          isDynamicReplyButtonsMsg: true,
          dynamicReplyButtons: [
            {
              buttonId: 'idYes',
              buttonText: {
                displayText: 'YES',
              },
              type: 1,
            },
            {
              buttonId: 'idNo',
              buttonText: {
                displayText: 'NO',
              },
              type: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
}
