"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const speaker_lock_1 = require("./speaker-lock");
const room_registry_1 = require("./room-registry");
const STALE_SWEEP_INTERVAL_MS = 15000;
const VALID_PING_TYPES = new Set(['break', 'slow', 'hazard', 'ok']);
let EventsGateway = class EventsGateway {
    constructor() {
        this.registry = new room_registry_1.RoomRegistry();
        this.speakerLock = new speaker_lock_1.SpeakerLock((roomName) => this.emitSpeakerCleared(roomName));
        this.sweepTimer = null;
    }
    onModuleInit() {
        this.sweepTimer = setInterval(() => this.sweepStaleParticipants(), STALE_SWEEP_INTERVAL_MS);
    }
    onModuleDestroy() {
        if (this.sweepTimer) {
            clearInterval(this.sweepTimer);
            this.sweepTimer = null;
        }
        this.speakerLock.dispose();
    }
    handleConnection(client) {
        console.log(`[WS CONNECT] Socket baglandi: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`[WS DISCONNECT] Socket ayrildi: ${client.id}`);
        const data = client.data;
        if (data && data.roomName && data.participantName) {
            this.leaveRoomInternal(client, data.roomName, data.participantName, true);
        }
    }
    handleJoinRoom(client, payload) {
        const { roomName, participantName, coords } = payload;
        if (!roomName || !participantName)
            return { success: false };
        client.join(roomName);
        client.data = { roomName, participantName };
        this.registry.join(roomName, participantName, client.id, coords);
        console.log(`[WS JOIN] ${participantName} "${roomName}" odasina katildi.`);
        this.broadcastRoomState(roomName);
        return { success: true };
    }
    handleHeartbeat(client, payload) {
        const { roomName, participantName, coords } = payload;
        if (!roomName || !participantName)
            return { success: false };
        client.data = { roomName, participantName };
        const touched = this.registry.touch(roomName, participantName, client.id, coords);
        if (!touched) {
            return this.handleJoinRoom(client, payload);
        }
        return { success: true };
    }
    handleLeaveRoom(client, payload) {
        const { roomName, participantName } = payload;
        if (!roomName || !participantName)
            return { success: false };
        this.leaveRoomInternal(client, roomName, participantName, false);
        return { success: true };
    }
    leaveRoomInternal(client, roomName, participantName, requireMatchingSocket) {
        client.leave(roomName);
        const removed = this.registry.leave(roomName, participantName, client.id, requireMatchingSocket);
        if (!removed)
            return;
        this.speakerLock.release(roomName, participantName);
        console.log(`[WS LEAVE] ${participantName} "${roomName}" odasindan ayrildi.`);
        this.broadcastRoomState(roomName);
    }
    handlePttStart(client, payload) {
        const { roomName, participantName } = payload;
        if (!roomName || !participantName)
            return;
        this.registry.touch(roomName, participantName, client.id);
        this.speakerLock.acquire(roomName, participantName);
        console.log(`[WS PTT START] ${participantName} konusuyor...`);
        this.server.to(roomName).emit('speaker_changed', {
            activeSpeaker: participantName,
        });
    }
    handlePttStop(client, payload) {
        const { roomName, participantName } = payload;
        if (!roomName || !participantName)
            return;
        this.registry.touch(roomName, participantName, client.id);
        this.releaseSpeaker(roomName, participantName);
    }
    releaseSpeaker(roomName, participantName) {
        if (this.speakerLock.release(roomName, participantName)) {
            this.emitSpeakerCleared(roomName);
        }
    }
    emitSpeakerCleared(roomName) {
        this.server.to(roomName).emit('speaker_changed', { activeSpeaker: null });
    }
    handleAudioBroadcast(client, payload) {
        const { roomName, sender, audioBase64 } = payload;
        if (!roomName || !sender || !audioBase64)
            return { success: false };
        this.registry.touch(roomName, sender, client.id);
        this.releaseSpeaker(roomName, sender);
        const newClip = this.registry.storeClip(roomName, sender, audioBase64);
        console.log(`[WS AUDIO BROADCAST] "${roomName}" odasina ${sender} ses gonderdi (boyut: ${audioBase64.length})`);
        client.to(roomName).emit('audio_incoming', newClip);
        return { success: true, audioId: newClip.id };
    }
    handleLocationUpdate(client, payload) {
        const { roomName, participantName, coords } = payload;
        if (!roomName || !participantName || !coords)
            return;
        this.registry.touch(roomName, participantName, client.id, coords);
        client.to(roomName).emit('location_broadcast', {
            participantName,
            coords,
        });
    }
    handleQuickPing(client, payload) {
        const { roomName, sender, pingType } = payload;
        if (!roomName || !sender || !VALID_PING_TYPES.has(pingType)) {
            return { success: false };
        }
        this.registry.touch(roomName, sender, client.id);
        const eventPayload = {
            id: Date.now(),
            sender,
            pingType,
            timestamp: Date.now(),
        };
        this.server.to(roomName).emit('quick_ping_incoming', eventPayload);
        return { success: true, pingId: eventPayload.id };
    }
    handleSetWaypoint(client, payload) {
        const { roomName, participantName, coords } = payload;
        if (!roomName || !participantName)
            return { success: false };
        if (!this.registry.touch(roomName, participantName, client.id)) {
            client.join(roomName);
            this.registry.join(roomName, participantName, client.id);
        }
        if (!this.registry.isLeader(roomName, participantName)) {
            return { success: false };
        }
        const waypoint = this.registry.setWaypoint(roomName, participantName, coords);
        this.server.to(roomName).emit('waypoint_updated', { waypoint });
        this.broadcastRoomState(roomName);
        return { success: true, waypoint };
    }
    sweepStaleParticipants() {
        const sweptRooms = this.registry.sweepStale();
        for (const { roomName, removedNames } of sweptRooms) {
            for (const participantName of removedNames) {
                this.speakerLock.release(roomName, participantName);
                console.log(`[WS SWEEP] ${participantName} zaman asimi nedeniyle "${roomName}" odasindan temizlendi.`);
            }
            this.broadcastRoomState(roomName);
        }
    }
    broadcastRoomState(roomName) {
        const activeSpeaker = this.speakerLock.getSpeaker(roomName);
        const snapshot = this.registry.getSnapshot(roomName, activeSpeaker);
        this.server.to(roomName).emit('room_state_update', snapshot);
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('heartbeat'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleHeartbeat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLeaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ptt_start'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handlePttStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ptt_stop'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handlePttStop", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('audio_broadcast'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleAudioBroadcast", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('location_update'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLocationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('quick_ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleQuickPing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('set_waypoint'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleSetWaypoint", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    })
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map