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
exports.TokenController = void 0;
const common_1 = require("@nestjs/common");
const roomParticipants = new Map();
const roomSpeakers = new Map();
const roomAudioStore = new Map();
let TokenController = class TokenController {
    async getToken(participantName, roomName) {
        if (!participantName) {
            throw new common_1.BadRequestException("participantName parametresi gerekli");
        }
        const targetRoom = roomName || "konvoy-gizli-oda";
        if (!roomParticipants.has(targetRoom)) {
            roomParticipants.set(targetRoom, new Map());
        }
        const roomMap = roomParticipants.get(targetRoom);
        roomMap.set(participantName, {
            id: participantName,
            name: participantName,
            roomName: targetRoom,
            lastSeen: Date.now(),
            isSpeaking: false,
        });
        return {
            token: `ws-token-${Date.now()}-${participantName}`,
            url: `http://localhost:3000`,
            roomName: targetRoom,
            participantName,
        };
    }
    getRoomState(roomName, participantName) {
        if (!roomName)
            return { participants: [], activeSpeaker: null };
        const roomMap = roomParticipants.get(roomName);
        if (!roomMap)
            return { participants: [], activeSpeaker: null };
        const now = Date.now();
        for (const [name, p] of roomMap.entries()) {
            if (now - p.lastSeen > 15000) {
                roomMap.delete(name);
            }
        }
        if (participantName && roomMap.has(participantName)) {
            roomMap.get(participantName).lastSeen = now;
        }
        const participants = Array.from(roomMap.values());
        const activeSpeaker = roomSpeakers.get(roomName) || null;
        return {
            participants,
            activeSpeaker,
        };
    }
    setSpeakState(body) {
        const { roomName, participantName, isSpeaking } = body;
        if (!roomName || !participantName)
            return { success: false };
        if (isSpeaking) {
            roomSpeakers.set(roomName, participantName);
        }
        else {
            if (roomSpeakers.get(roomName) === participantName) {
                roomSpeakers.set(roomName, null);
            }
        }
        return { success: true, activeSpeaker: roomSpeakers.get(roomName) };
    }
    updateLocation(body) {
        const { roomName, participantName, coords } = body;
        const roomMap = roomParticipants.get(roomName);
        if (roomMap && roomMap.has(participantName)) {
            const p = roomMap.get(participantName);
            p.coords = coords;
            p.lastSeen = Date.now();
        }
        return { success: true };
    }
    leaveRoom(body) {
        const { roomName, participantName } = body;
        const roomMap = roomParticipants.get(roomName);
        if (roomMap) {
            roomMap.delete(participantName);
        }
        if (roomSpeakers.get(roomName) === participantName) {
            roomSpeakers.set(roomName, null);
        }
        return { success: true };
    }
    uploadAudio(body) {
        const { roomName, sender, audioBase64 } = body;
        console.log(`[UPLOAD] roomName="${roomName}" sender="${sender}" audioBase64 length=${audioBase64?.length ?? 0}`);
        if (!roomName || !sender || !audioBase64) {
            console.log('[UPLOAD] REJECTED - missing fields!');
            return { success: false };
        }
        if (!roomAudioStore.has(roomName)) {
            roomAudioStore.set(roomName, []);
        }
        const clips = roomAudioStore.get(roomName);
        const newClip = {
            id: Date.now(),
            sender,
            audioBase64,
            timestamp: Date.now(),
        };
        clips.push(newClip);
        if (clips.length > 10) {
            clips.shift();
        }
        console.log(`[UPLOAD] SAVED! roomName="${roomName}" audioId=${newClip.id} totalClips=${clips.length}`);
        return { success: true, audioId: newClip.id };
    }
    getLatestAudio(roomName, lastAudioId, senderName) {
        if (!roomName)
            return { clip: null };
        const clips = roomAudioStore.get(roomName) || [];
        const lastId = Number(lastAudioId) || 0;
        const newClip = clips.find((c) => c.id > lastId && c.sender !== senderName);
        if (newClip) {
            return { clip: newClip };
        }
        return { clip: null };
    }
};
exports.TokenController = TokenController;
__decorate([
    (0, common_1.Get)("token"),
    __param(0, (0, common_1.Query)("participantName")),
    __param(1, (0, common_1.Query)("roomName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TokenController.prototype, "getToken", null);
__decorate([
    (0, common_1.Get)("room-state"),
    __param(0, (0, common_1.Query)("roomName")),
    __param(1, (0, common_1.Query)("participantName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TokenController.prototype, "getRoomState", null);
__decorate([
    (0, common_1.Post)("speak"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TokenController.prototype, "setSpeakState", null);
__decorate([
    (0, common_1.Post)("location"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TokenController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Post)("leave"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TokenController.prototype, "leaveRoom", null);
__decorate([
    (0, common_1.Post)("audio/upload"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TokenController.prototype, "uploadAudio", null);
__decorate([
    (0, common_1.Get)("audio/latest"),
    __param(0, (0, common_1.Query)("roomName")),
    __param(1, (0, common_1.Query)("lastAudioId")),
    __param(2, (0, common_1.Query)("senderName")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], TokenController.prototype, "getLatestAudio", null);
exports.TokenController = TokenController = __decorate([
    (0, common_1.Controller)()
], TokenController);
//# sourceMappingURL=token.controller.js.map