import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, payload: {
        roomName: string;
        participantName: string;
        coords?: any;
    }): {
        success: boolean;
    };
    handleLeaveRoom(client: Socket, payload: {
        roomName: string;
        participantName: string;
    }): {
        success: boolean;
    };
    private leaveRoomInternal;
    handlePttStart(client: Socket, payload: {
        roomName: string;
        participantName: string;
    }): void;
    handleAudioBroadcast(client: Socket, payload: {
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
    handleLocationUpdate(client: Socket, payload: {
        roomName: string;
        participantName: string;
        coords: any;
    }): void;
    private broadcastRoomState;
}
