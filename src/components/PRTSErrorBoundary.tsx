// src/components/PRTSErrorBoundary.tsx
// PRTS 긴급 시스템 진단 및 예외 복구 콘솔 (White Screen 방지)

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Download, Trash2, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class PRTSErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('【PRTS_CRITICAL_FAULT】 UI 렌더링 중 치명적 예외 발생:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleExportBackup = () => {
    try {
      const backupData: Record<string, string | null> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('terra_') || key.startsWith('prts_'))) {
          backupData[key] = localStorage.getItem(key);
        }
      }
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prts_emergency_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('백업 파일 내보내기 중 오류가 발생했습니다: ' + String(e));
    }
  };

  private handleResetStorage = () => {
    if (window.confirm('저장된 현재 캐릭터 진행 데이터를 초기화하고 PRTS를 재부팅하시겠습니까? (글로벌 업적 및 설정은 보존됩니다)')) {
      try {
        localStorage.removeItem('terra_life_active_character');
        localStorage.removeItem('terra_life_active_logs');
        window.location.reload();
      } catch (e) {
        alert('스토리지 초기화 실패: ' + String(e));
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || '알 수 없는 시스템 예외';
      const stack = this.state.error?.stack || this.state.errorInfo?.componentStack || '스택 추적 정보 없음';

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-mono select-text">
          <div className="max-w-2xl w-full bg-slate-900/90 border-2 border-red-500/70 rounded-lg p-6 shadow-2xl backdrop-blur relative overflow-hidden">
            {/* PRTS 테마 상단 배너 */}
            <div className="flex items-center justify-between border-b border-red-500/30 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
                <span className="font-black tracking-widest text-lg uppercase">PRTS // CRITICAL SYSTEM INTERRUPT</span>
              </div>
              <div className="text-xs text-red-500/80 bg-red-950/50 px-2 py-0.5 rounded border border-red-500/30">
                FAULT_CODE: 0xPRTS_UI_EXCEPTION
              </div>
            </div>

            {/* 안내 문구 */}
            <div className="mb-4 text-sm text-slate-300 space-y-2">
              <p className="font-bold text-red-300">
                터미널 렌더링 중 예외가 감지되어 PRTS 안전 격리 방어벽이 작동했습니다.
              </p>
              <p className="text-xs text-slate-400">
                화면 전체가 언마운트되는 현상을 방지하고 세이브 데이터를 안전하게 보존 중입니다. 아래 복구 수단을 통해 시스템을 재정렬하십시오.
              </p>
            </div>

            {/* 예외 상세 내역 (접이식) */}
            <div className="bg-slate-950 border border-slate-800 rounded p-3 mb-6 text-xs overflow-x-auto max-h-48 scrollbar-thin">
              <div className="text-red-400 font-bold mb-1 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>예외 메시지: {errorMsg}</span>
              </div>
              <pre className="text-slate-500 whitespace-pre-wrap leading-relaxed text-[11px]">
                {stack}
              </pre>
            </div>

            {/* 비상 대응 제어 패널 */}
            <div className="flex flex-wrap gap-3 justify-end pt-2 border-t border-slate-800">
              <button
                onClick={this.handleExportBackup}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded border border-slate-700 transition"
                title="로컬 스토리지에 남아있는 세이브를 JSON 파일로 다운로드합니다."
              >
                <Download className="w-4 h-4 text-cyan-400" />
                세이브 백업 다운로드
              </button>

              <button
                onClick={this.handleResetStorage}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-300 text-xs font-bold rounded border border-red-800/50 transition"
                title="진행 중인 세이브만 안전하게 초기화합니다."
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                진행 세이브 초기화
              </button>

              <button
                onClick={this.handleReload}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold rounded shadow-lg transition"
              >
                <RefreshCw className="w-4 h-4" />
                PRTS 재부팅
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
