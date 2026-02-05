// 语音录制工具

import type { VoiceMemo } from '../types';
import { generateId } from './helpers';
import { saveAudioBlob } from '../db/operations';

export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private startTime: number = 0;

  async start(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.startTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('无法启动录音:', error);
      throw new Error('无法访问麦克风，请检查权限设置');
    }
  }

  async stop(): Promise<VoiceMemo> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('录音未开始'));
        return;
      }

      this.mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const durationMs = Date.now() - this.startTime;
          const memoId = generateId();

          // 保存到 IndexedDB
          await saveAudioBlob(memoId, audioBlob);

          const memo: VoiceMemo = {
            id: memoId,
            audioBlobPath: memoId,
            durationMs,
            createdAt: this.startTime
          };

          // 停止所有音轨
          this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());

          resolve(memo);
        } catch (error) {
          reject(error);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  cancel(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    this.audioChunks = [];
  }

  get isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }

  get duration(): number {
    if (!this.isRecording) return 0;
    return Date.now() - this.startTime;
  }
}

/**
 * 播放音频
 */
export function playAudio(audioBlob: Blob): HTMLAudioElement {
  const audioURL = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioURL);
  
  audio.onended = () => {
    URL.revokeObjectURL(audioURL);
  };
  
  audio.play();
  return audio;
}

/**
 * 格式化录音时长
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
