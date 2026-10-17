import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Coordinates, QuickPingType } from './room-registry';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
    server: Server;
    private readonly registry;
    private readonly speakerLock;
    private sweepTimer;
    onModuleInit(): void;
    onModuleDestroy(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, payload: {
        roomName: string;
        participantName: string;
        coords?: Coordinates;
    }): {
        success: boolean;
    };
    handleHeartbeat(client: Socket, payload: {
        roomName: string;
        participantName: string;
        coords?: Coordinates;
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
    handlePttStop(client: Socket, payload: {
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
        coords: Coordinates;
    }): void;
    handleQuickPing(client: Socket, payload: {
        roomName: string;
        sender: string;
        pingType: QuickPingType;
    }): {
        success: boolean;
        pingId?: undefined;
    } | {
        success: boolean;
        pingId: number;
    };
    handleSetWaypoint(client: Socket, payload: {
        roomName: string;
        participantName: string;
        coords: {
            latitude: number;
            longitude: number;
        } | null;
    }): {
        success: boolean;
        waypoint?: undefined;
    } | {
        success: boolean;
        waypoint: import("./room-registry").RoomWaypoint | null;
    };
    private sweepStaleParticipants;
    private broadcastRoomState;
}
