// -----------------------------------------------------------------------------------------------------
// @ AUTH UTILITIES
//
// Methods are derivations of the Auth0 Angular-JWT helper service methods
// https://github.com/auth0/angular2-jwt
// -----------------------------------------------------------------------------------------------------

export class AuthUtils {
    /**
     * Constructor
     */
    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Is token expired?
     *
     * @param token
     * @param offsetSeconds
     */
    static isTokenExpired(token: string, offsetSeconds?: number): boolean {
        try {
            // Verifica si el token está vacío
            if (!token) {
                return true;
            }

            // Obtiene la fecha de expiración del token
            const expirationDate = this._getTokenExpirationDateV2(token);

            // Si no se pudo obtener la fecha, se considera expirado
            if (!expirationDate) {
                return true;
            }

            // Verifica si la fecha actual es mayor a la fecha de expiración menos el offset
            return (
                expirationDate.getTime() <=
                new Date().getTime() + offsetSeconds * 1000
            );
        } catch (error) {
            console.error(
                'Error al verificar si el token está expirado:',
                error
            );
            return true;
        }
    }

    // try {
    //     // Return if there is no token
    //     if (!token || token === '') {
    //         return true;
    //     }

    //     // Get the expiration date
    //     const date = this._getTokenExpirationDate(token);

    //     offsetSeconds = offsetSeconds || 0;

    //     if (date === null) {
    //         return true;
    //     }

    //     // Check if the token is expired
    //     return !(
    //         date.valueOf() >
    //         new Date().valueOf() + offsetSeconds * 1000
    //     );
    // } catch (error) {
    //     console.error(error);
    // }

    static isTokenExpiringSoon(
        token: string,
        thresholdSeconds: number = 300
    ): boolean {
        try {
            // Verifica si el token está vacío
            if (!token) {
                return false;
            }

            // Obtiene la fecha de expiración del token
            const expirationDate = this._getTokenExpirationDateV2(token);

            // Si no se pudo obtener la fecha, no se considera que está a punto de expirar
            if (!expirationDate) {
                return false;
            }

            // Calcula el tiempo restante hasta la expiración
            const timeUntilExpiration =
                expirationDate.getTime() - new Date().getTime();

            // Verifica si el tiempo restante es menor al umbral (5 minutos por defecto)
            return timeUntilExpiration <= thresholdSeconds * 1000;
        } catch (error) {
            console.error(
                'Error al verificar si el token está a punto de expirar:',
                error
            );
            return false;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Base64 decoder
     * Credits: https://github.com/atk
     *
     * @param str
     * @private
     */
    private static _b64decode(str: string): string {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = '';

        str = String(str).replace(/=+$/, '');

        if (str.length % 4 === 1) {
            throw new Error(
                "'atob' failed: The string to be decoded is not correctly encoded."
            );
        }

        /* eslint-disable */
        for (
            // initialize result and counters
            let bc = 0, bs: any, buffer: any, idx = 0;
            // get next character
            (buffer = str.charAt(idx++));
            // character found in table? initialize bit storage and add its ascii value;
            ~buffer &&
            ((bs = bc % 4 ? bs * 64 + buffer : buffer),
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            bc++ % 4)
                ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0
        ) {
            // try to find character in table (0-63, not found => -1)
            buffer = chars.indexOf(buffer);
        }
        /* eslint-enable */

        return output;
    }

    /**
     * Base64 unicode decoder
     *
     * @param str
     * @private
     */
    private static _b64DecodeUnicode(str: any): string {
        return decodeURIComponent(
            Array.prototype.map
                .call(
                    this._b64decode(str),
                    (c: any) =>
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join('')
        );
    }

    /**
     * URL Base 64 decoder
     *
     * @param str
     * @private
     */
    private static _urlBase64Decode(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw Error('Illegal base64url string!');
            }
        }
        return this._b64DecodeUnicode(output);
    }

    /**
     * Decode token
     *
     * @param token
     * @private
     */
    private static _decodeToken(token: string): any {
        // Return if there is no token
        if (!token) {
            return null;
        }

        // Split the token
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error(
                "The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more."
            );
        }

        // Decode the token using the Base64 decoder
        const decoded = this._urlBase64Decode(parts[1]);

        if (!decoded) {
            throw new Error('Cannot decode the token.');
        }

        return JSON.parse(decoded);
    }

    /**
     * Get token expiration date
     *
     * @param token
     * @private
     */
    private static _getTokenExpirationDate(token: string): Date | null {
        // Get the decoded token
        const decodedToken = this._decodeToken(token);

        // Return if the decodedToken doesn't have an 'exp' field
        if (!decodedToken.hasOwnProperty('exp')) {
            return null;
        }

        // Convert the expiration date
        const date = new Date(0);
        date.setUTCSeconds(decodedToken.exp);

        return date;
    }

    /**
     * Decodifica el token y obtiene la fecha de expiración
     *
     * @param token - JWT a decodificar
     * @returns Fecha de expiración o null si no está presente
     */
    private static _getTokenExpirationDateV2(token: string): Date | null {
        const decodedToken = this._decodeTokenV2(token);

        // Verifica que el token decodificado tenga el campo 'exp'
        if (!decodedToken || !decodedToken.exp) {
            return null;
        }

        // Convierte el campo 'exp' a una fecha
        const expirationDate = new Date(0);
        expirationDate.setUTCSeconds(decodedToken.exp);

        return expirationDate;
    }

    /**
     * Decodifica el JWT sin verificar la firma
     *
     * @param token - JWT a decodificar
     * @returns Payload decodificado del token
     */
    private static _decodeTokenV2(token: string): any {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = this._urlBase64DecodeV2(payload);
            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    }

    /**
     * Decodifica una cadena base64url a una cadena normal
     *
     * @param str - Cadena base64url
     * @returns Cadena decodificada
     */
    private static _urlBase64DecodeV2(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw new Error('Cadena base64url ilegal.');
        }
        return decodeURIComponent(
            atob(output)
                .split('')
                .map(
                    (c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`
                )
                .join('')
        );
    }
}
