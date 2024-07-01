# Receiving Messages

To receive messages, you can use the code below

```javascript
// Supports ES6
// import { create, Whatsapp } from '@wppconnect-team/wppconnect';
const wppconnect = require('@wppconnect-team/wppconnect');

wppconnect
  .create()
  .then((client) => client.start())
  .catch((error) => console.log(error));

function start(client) {
  client.onMessage((message) => {
    if (message.body === 'Hello') {
      client
        .sendText(message.from, 'Hello, how I may help you?')
        .then((result) => {
          console.log('Result: ', result); //return success object
        })
        .catch((error) => {
          console.error('Error when sending: ', error); //return error object
        });
    }
  });
  client.start()
}
```
