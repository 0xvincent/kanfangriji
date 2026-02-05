// 语音录制组件

import { useState, useEffect, useRef } from 'react';
import type { VoiceMemo } from '../types';
import { VoiceRecorder, formatDuration, playAudio } from '../utils/audioRecorder';
import { getAudioBlob, deleteAudioBlob } from '../db/operations';

interface VoiceRecorderProps {
  memos: VoiceMemo[];
  onMemosChange: (memos: VoiceMemo[]) => void;
}

export default function VoiceRecorderComponent({ memos, onMemosChange }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingMemoId, setPlayingMemoId] = useState<string | null>(null);
  
  const recorderRef = useRef<VoiceRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // 清理定时器
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // 停止播放
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      recorderRef.current = new VoiceRecorder();
      await recorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // 开始计时
      timerRef.current = window.setInterval(() => {
        if (recorderRef.current) {
          setRecordingDuration(recorderRef.current.duration);
        }
      }, 100);
    } catch (error) {
      console.error('录音启动失败:', error);
      alert('无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    
    try {
      const memo = await recorderRef.current.stop();
      onMemosChange([...memos, memo]);
      
      setIsRecording(false);
      setRecordingDuration(0);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } catch (error) {
      console.error('录音保存失败:', error);
    }
  };

  const cancelRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.cancel();
      setIsRecording(false);
      setRecordingDuration(0);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playMemo = async (memo: VoiceMemo) => {
    try {
      // 停止当前播放
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const blob = await getAudioBlob(memo.audioBlobPath);
      if (!blob) return;
      
      audioRef.current = playAudio(blob);
      setPlayingMemoId(memo.id);
      
      audioRef.current.onended = () => {
        setPlayingMemoId(null);
      };
    } catch (error) {
      console.error('播放失败:', error);
    }
  };

  const stopPlaying = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingMemoId(null);
    }
  };

  const deleteMemo = async (memo: VoiceMemo) => {
    try {
      await deleteAudioBlob(memo.audioBlobPath);
      onMemosChange(memos.filter(m => m.id !== memo.id));
      
      if (playingMemoId === memo.id) {
        stopPlaying();
      }
    } catch (error) {
      console.error('删除录音失败:', error);
    }
  };

  return (
    <div className="space-y-m">
      {/* 录音控制 */}
      <div className="bg-gray-50 rounded-lg p-m">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-full py-m bg-primary text-white rounded-button text-body font-semibold"
          >
            🎤 开始录音
          </button>
        ) : (
          <div className="space-y-m">
            <div className="text-center">
              <div className="text-score-large text-primary mb-xs">
                {formatDuration(recordingDuration)}
              </div>
              <div className="text-secondary">录音中...</div>
            </div>
            
            <div className="flex gap-s">
              <button
                onClick={cancelRecording}
                className="flex-1 py-m border border-border-line rounded-button text-body"
              >
                取消
              </button>
              <button
                onClick={stopRecording}
                className="flex-1 py-m bg-primary text-white rounded-button text-body font-semibold"
              >
                完成
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 录音列表 */}
      {memos.length > 0 && (
        <div className="space-y-s">
          <div className="text-secondary text-secondary">已录制 {memos.length} 条</div>
          {memos.map((memo, index) => (
            <div
              key={memo.id}
              className="flex items-center gap-m p-m border border-border-line rounded-lg"
            >
              <button
                onClick={() => playingMemoId === memo.id ? stopPlaying() : playMemo(memo)}
                className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full"
              >
                {playingMemoId === memo.id ? '⏸' : '▶'}
              </button>
              
              <div className="flex-1">
                <div className="text-body">录音 {index + 1}</div>
                <div className="text-secondary">{formatDuration(memo.durationMs)}</div>
              </div>
              
              <button
                onClick={() => deleteMemo(memo)}
                className="w-8 h-8 text-red-500 text-xl"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
