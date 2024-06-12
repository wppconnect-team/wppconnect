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
 * Interface de dados para os eventos de Localização em tempo real
 */
export interface LiveLocation {
  /**
   * Tipo de evento de Localização em tempo real
   * * enable - Quando inicia o compartilhamento
   * * update - Atualzação de localização
   * * disable - Fim do compartilhamento
   */
  type: 'enable' | 'update' | 'disable';

  /**
   * ID de contato que realizou o compartilhamento
   */
  id: string;

  /**
   * Latitude em graus
   */
  lat: number;

  /**
   * Longitude em graus
   */
  lng: number;

  /**
   * Velocidade atual em milhar por hora (mp/h)
   */
  speed: number;

  /**
   * Precisão da localização em metros
   */
  accuracy?: number;

  /**
   * Tempo em segundos após o último compartilhamento
   */
  elapsed?: number;

  /**
   * Graus de direção
   */
  degrees?: number;

  /**
   * Tempo em segundos para o compartilhamento
   * Somente no type:enable
   */
  shareDuration?: number;
}
