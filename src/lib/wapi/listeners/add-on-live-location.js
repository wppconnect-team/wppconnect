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

export function addOnLiveLocation() {
  const callbacks = [];

  /**
   * Dispara o evento com dados formatados
   */
  function fireCallback(data) {
    const location = Object.assign({}, data);
    if (location.jid) {
      location.id = location.jid.toString();
    }
    delete location.jid;
    delete location.body;
    delete location.isLive;
    delete location.sequence;

    for (const callback of callbacks) {
      try {
        callback(location);
      } catch (error) {}
    }
  }

  /**
   * Substitui o manipulador original para capturar todos eventos,
   * pois o Store.LiveLocation só inicializa a partir de uma mensagem,
   * caso a mensagem fique muito para atrás (após troca de 50 mensagens),
   * ele não é inicializado até carregar a mensage.
   */
  const originalHandle = WPP.whatsapp.LiveLocationStore.handle;
  WPP.whatsapp.LiveLocationStore.handle = function (list) {
    originalHandle.apply(this, arguments);

    for (const p of list) {
      fireCallback(p);
    }
  };

  // Para cada novo LiveLocation inicializado, força a vizualização de mapa de todos
  WPP.whatsapp.LiveLocationStore.on('add', () => {
    setTimeout(() => {
      WPP.whatsapp.LiveLocationStore.forEach((l) => {
        l.startViewingMap();
        setTimeout(() => {
          try {
            l._startKeepAlive();
          } catch (error) {}
        }, 1000);
      });
    }, 100);
  });

  // Força a inicialização de localização para todos chats ativos
  WPP.whatsapp.ChatStore.map((c) => WPP.whatsapp.LiveLocationStore.find(c.id));

  // Caso receba nova mensagem de localização, inicializa o LiveLocation e dispara o primeiro evento
  WAPI.waitNewMessages(false, (messages) => {
    for (const message of messages) {
      if (message.isLive) {
        fireCallback({
          type: 'enable',
          isLive: message.isLive,
          id: message.sender.id,
          lat: message.lat,
          lng: message.lng,
          accuracy: message.accuracy,
          speed: message.speed,
          degrees: message.degrees,
          sequence: message.sequence,
          shareDuration: message.shareDuration,
        });
      }
    }
  });

  window.WAPI.onLiveLocation = async function (callback) {
    callbacks.push(callback);
  };
}
