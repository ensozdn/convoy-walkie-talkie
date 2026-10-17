import { OnModuleDestroy } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
    server: Server;
    private readonly speakerLock;
    onModuleDestroy(): void;
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
    handlePttStop(payload: {
        roomName: string;
        participantName: string;
    }): void;
    private releaseSpeaker;
    private emitSpeakerCleared;
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
