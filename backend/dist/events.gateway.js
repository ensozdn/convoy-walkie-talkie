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
const roomsMap = new Map();
const roomActiveSpeaker = new Map();
const roomAudioClips = new Map();
let EventsGateway = class EventsGateway {
    handleConnection(client) {
        console.log(`[WS CONNECT] Socket bağlandı: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`[WS DISCONNECT] Socket ayrıldı: ${client.id}`);
        const data = client.data;
        if (data && data.roomName && data.participantName) {
            this.leaveRoomInternal(client, data.roomName, data.participantName);
        }
    }
    handleJoinRoom(client, payload) {
        const { roomName, participantName, coords } = payload;
        if (!roomName || !participantName)
            return { success: false };
        client.join(roomName);
        client.data = { roomName, participantName };
        if (!roomsMap.has(roomName)) {
            roomsMap.set(roomName, new Map());
        }
        const participants = roomsMap.get(roomName);
        participants.set(participantName, {
            socketId: client.id,
            name: participantName,
            roomName,
            lastSeen: Date.now(),
            isSpeaking: false,
            coords: coords || null,
        });
        console.log(`[WS JOIN] ${participantName} "${roomName}" odasına katıldı.`);
        this.broadcastRoomState(roomName);
        return { success: true };
    }
    handleLeaveRoom(client, payload) {
        const { roomName, participantName } = payload;
        this.leaveRoomInternal(client, roomName, participantName);
        return { success: true };
    }
    leaveRoomInternal(client, roomName, participantName) {
        client.leave(roomName);
        if (roomsMap.has(roomName)) {
            const participants = roomsMap.get(roomName);
            participants.delete(participantName);
            if (participants.size === 0) {
                roomsMap.delete(roomName);
                roomActiveSpeaker.delete(roomName);
                roomAudioClips.delete(roomName);
            }
        }
        console.log(`[WS LEAVE] ${participantName} "${roomName}" odasından ayrıldı.`);
        this.broadcastRoomState(roomName);
    }
    handlePttStart(client, payload) {
        const { roomName, participantName } = payload;
        if (!roomName || !participantName)
            return;
        roomActiveSpeaker.set(roomName, participantName);
        console.log(`[WS PTT START] ${participantName} konuşuyor...`);
        this.server.to(roomName).emit('speaker_changed', {
            activeSpeaker: participantName,
        });
    }
    handleAudioBroadcast(client, payload) {
        const { roomName, sender, audioBase64 } = payload;
        if (!roomName || !sender || !audioBase64)
            return { success: false };
        if (roomActiveSpeaker.get(roomName) === sender) {
            roomActiveSpeaker.set(roomName, null);
            this.server.to(roomName).emit('speaker_changed', { activeSpeaker: null });
        }
        const newClip = {
            id: Date.now(),
            sender,
            audioBase64,
            timestamp: Date.now(),
        };
        if (!roomAudioClips.has(roomName)) {
            roomAudioClips.set(roomName, []);
        }
        const clips = roomAudioClips.get(roomName);
        clips.push(newClip);
        if (clips.length > 5)
            clips.shift();
        console.log(`[WS AUDIO BROADCAST] "${roomName}" odasına ${sender} ses gönderdi (boyut: ${audioBase64.length})`);
        client.to(roomName).emit('audio_incoming', newClip);
        return { success: true, audioId: newClip.id };
    }
    handleLocationUpdate(client, payload) {
        const { roomName, participantName, coords } = payload;
        if (!roomName || !participantName || !coords)
            return;
        if (roomsMap.has(roomName)) {
            const participants = roomsMap.get(roomName);
            const p = participants.get(participantName);
            if (p) {
                p.coords = coords;
                p.lastSeen = Date.now();
            }
        }
        client.to(roomName).emit('location_broadcast', {
            participantName,
            coords,
        });
    }
    broadcastRoomState(roomName) {
        if (!roomsMap.has(roomName)) {
            this.server.to(roomName).emit('room_state_update', {
                participants: [],
                activeSpeaker: null,
            });
            return;
        }
        const participants = Array.from(roomsMap.get(roomName).values()).map((p) => ({
            name: p.name,
            coords: p.coords,
            isSpeaking: p.isSpeaking,
        }));
        const activeSpeaker = roomActiveSpeaker.get(roomName) || null;
        this.server.to(roomName).emit('room_state_update', {
            participants,
            activeSpeaker,
        });
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
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    })
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map