interface ParticipantData {
    id: string;
    name: string;
    roomName: string;
    lastSeen: number;
    isSpeaking: boolean;
    coords?: {
        latitude: number;
        longitude: number;
    };
}
interface AudioClip {
    id: number;
    sender: string;
    audioBase64: string;
    timestamp: number;
}
export declare class TokenController {
    getToken(participantName: string, roomName?: string): Promise<{
        token: string;
        url: string;
        roomName: string;
        participantName: string;
    }>;
    getRoomState(roomName: string, participantName: string): {
        participants: ParticipantData[];
        activeSpeaker: string;
    };
    setSpeakState(body: {
        roomName: string;
        participantName: string;
        isSpeaking: boolean;
    }): {
        success: boolean;
        activeSpeaker?: undefined;
    } | {
        success: boolean;
        activeSpeaker: string;
    };
    updateLocation(body: {
        roomName: string;
        participantName: string;
        coords: {
            latitude: number;
            longitude: number;
        };
    }): {
        success: boolean;
    };
    leaveRoom(body: {
        roomName: string;
        participantName: string;
    }): {
        success: boolean;
    };
    uploadAudio(body: {
        roomName: string;
        sender: string;
        audioBase64: string;
    }): {
        success: boolean;
        audioId?: undefined;
    } | {
        success: boolean;
        audioId: number;
    };
    getLatestAudio(roomName: string, lastAudioId: string, senderName: string): {
        clip: AudioClip;
    };
}
export {};
