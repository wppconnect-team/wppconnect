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

/**
 * Parâmetros para retorno de mensagens
 */
export interface GetMessagesParam {
  /**
   * Quantidade de mensagens para retornar
   * informar `-1` para trazer tudo (Pode demorar e travar a interface)
   *
   * @default 20
   */
  count?: number;
  /**
   * ID da última mensagem para continuar a busca
   * Isso funciona como paginação, então ao pegar um ID,
   * você pode utilizar para obter as próximas mensagens a partir dele
   */
  id?: string;
  fromMe?: boolean;
  /**
   * Se você deseja recuperar as mensagems antes(before) ou depois(after)
   * do ID informado.
   *
   * @default 'before'
   */
  direction?: 'before' | 'after';
}
