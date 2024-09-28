import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor() {}

    /**
     * Codifica y guarda un valor en Base64 en el localStorage con una caducidad de 4 horas
     *
     * @param key - Clave para almacenar el dato
     * @param value - Valor a codificar y guardar
     */
    public store(key: string, value: string): void {
        try {
            const encodedValue = this.encodeBase64(value);
            const expirationTime = new Date().getTime() + 4 * 60 * 60 * 1000; // 4 horas en milisegundos

            // Guarda el dato junto con la fecha de expiración
            const dataToStore = {
                value: encodedValue,
                expiration: expirationTime,
            };

            localStorage.setItem(key, JSON.stringify(dataToStore));
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    /**
     * Recupera y decodifica un valor de localStorage si no ha caducado
     *
     * @param key - Clave para recuperar el dato
     * @returns Valor decodificado o null si ha caducado o no existe
     */
    public find(key: string): string | null {
        try {
            const storedData = localStorage.getItem(key);

            if (!storedData) {
                return null;
            }

            const parsedData = JSON.parse(storedData);
            const currentTime = new Date().getTime();

            // Verifica si el dato ha caducado
            if (currentTime > parsedData.expiration) {
                localStorage.removeItem(key); // Remueve el dato caducado
                return null;
            }

            return this.decodeBase64(parsedData.value);
        } catch (error) {
            console.error('Error al recuperar del localStorage:', error);
            return null;
        }
    }

    /**
     * Codifica una cadena en Base64 utilizando btoa
     *
     * @param data - Cadena a codificar
     * @returns Cadena codificada en Base64
     */
    private encodeBase64(data: string): string {
        try {
            return btoa(unescape(encodeURIComponent(data)));
        } catch (error) {
            console.error('Error al codificar la cadena:', error);
            return '';
        }
    }

    /**
     * Decodifica una cadena Base64 utilizando atob
     *
     * @param encodedData - Cadena codificada en Base64
     * @returns Cadena decodificada
     */
    private decodeBase64(encodedData: string): string {
        try {
            return decodeURIComponent(escape(atob(encodedData)));
        } catch (error) {
            console.error('Error al decodificar la cadena:', error);
            return '';
        }
    }
}
