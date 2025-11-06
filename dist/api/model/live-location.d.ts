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
