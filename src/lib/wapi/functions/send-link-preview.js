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

export async function sendLinkPreview(chatId, url, text) {
  text = text || '';
  const _Path = {
    Protocol: '^(https?:\\/\\/)?',
    Domain: '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|',
    IP: '((\\d{1,3}\\.){3}\\d{1,3}))',
    Port: '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*',
    Query: '(\\?[;&a-z\\d%_.~+=-]*)?',
    End: '(\\#[-a-z\\d_]*)?$',
    Reg: () => {
      return new RegExp(
        _Path.Protocol +
          _Path.Domain +
          _Path.IP +
          _Path.Port +
          _Path.Query +
          _Path.End,
        'i'
      );
    },
  };
  if (!_Path.Reg().test(url)) {
    var text =
      'Use a valid HTTP protocol. Example: https://www.youtube.com/watch?v=V1bFr2SWP1';
    return WAPI.scope(chatId, true, null, text);
  }
  var chat = await WAPI.sendExist(chatId);
  if (!chat.erro) {
    // There are no support for link preview with MD
    const linkPreview = WPP.conn.isMultiDevice()
      ? undefined
      : await WPP.whatsapp.functions.queryLinkPreview(url);
    var result =
      (await chat.sendMessage(text.includes(url) ? text : `${url}\n${text}`, {
        linkPreview,
      })) || '';
    var m = { type: 'LinkPreview', url: url, text: text },
      To = await WAPI.getchatId(chat.id);
    if (result === 'success' || result === 'OK') {
      var obj = WAPI.scope(To, false, result, null);
      Object.assign(obj, m);
      return obj;
    } else {
      var obj = WAPI.scope(To, true, result, null);
      Object.assign(obj, m);
      return obj;
    }
  } else {
    return chat;
  }
}
