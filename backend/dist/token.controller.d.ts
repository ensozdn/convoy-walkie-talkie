export declare class TokenController {
    getToken(participantName: string): Promise<{
        token: string;
        wsUrl: string;
        roomName: string;
        participantName: string;
    }>;
}
