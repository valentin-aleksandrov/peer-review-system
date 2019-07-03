//import * as jwt_decode from 'jwt-decode';
export class JWTDecoderService {
    public getPayload(jwt: string): any {
        const [header, payload] = jwt.split('.');
        const decodedPayload = JSON.parse(window.atob(payload));
        return decodedPayload;
    }
}