const MAX_SPEAKING_MS = 25000;

export class SpeakerLock {
  private readonly speakers = new Map<string, string>();
  private readonly timers = new Map<string, NodeJS.Timeout>();

  constructor(private readonly onExpire: (roomName: string) => void) {}

  getSpeaker(roomName: string): string | null {
    return this.speakers.get(roomName) ?? null;
  }

  acquire(roomName: string, participantName: string): void {
    this.clearTimer(roomName);
    this.speakers.set(roomName, participantName);
    this.timers.set(
      roomName,
      setTimeout(() => {
        console.warn(`[SPEAKER LOCK] ${participantName} ${MAX_SPEAKING_MS} ms sonra otomatik susturuldu: ${roomName}`);
        this.release(roomName);
        this.onExpire(roomName);
      }, MAX_SPEAKING_MS),
    );
  }

  release(roomName: string, participantName?: string): boolean {
    const currentSpeaker = this.speakers.get(roomName);
    if (!currentSpeaker) return false;
    if (participantName && currentSpeaker !== participantName) return false;
    this.clearTimer(roomName);
    this.speakers.delete(roomName);
    return true;
  }

  dispose(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.speakers.clear();
  }

  private clearTimer(roomName: string): void {
    const timer = this.timers.get(roomName);
    if (timer) clearTimeout(timer);
    this.timers.delete(roomName);
  }
}
