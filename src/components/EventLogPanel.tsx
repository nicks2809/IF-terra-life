// src/components/EventLogPanel.tsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { LogEntry, GameEvent, EventChoice, Character, ThemeMode, LogFilter, NationThemeId } from '../types';
import { GameEngine } from '../engine/gameEngine';
import { resolveNationId, getNationVisualIdentity } from '../utils/themeResolver';
import { Radio, AlertTriangle, Sparkles, Sword, Dices, ChevronRight, Bot, Play, FastForward, Filter, Lock, Clock, Search, ArrowDown } from 'lucide-react';

interface Props {
  logs: LogEntry[];
  currentEvent?: GameEvent;
  character: Character;
  nationId?: NationThemeId;
  onSelectChoice: (choice: EventChoice) => void;
  autoChoicePendingId?: string | null;
  minorTimeoutRemainingSec?: number | null;
  isPlaying?: boolean;
  onNextYear?: () => void;
  onSkipToNextEvent?: () => void;
  onTogglePlay?: () => void;
  onFlowThroughEvent?: () => void;
  theme: ThemeMode;
}

const getChapterForAge = (age: number): { num: number; title: string; subtitle: string; quote: string } => {
  if (age < 15) {
    return {
      num: 1,
      title: '제1장: 여명(黎明)의 요람',
      subtitle: '0세 ~ 14세 · 유년과 배움의 계절',
      quote: '광석과 재앙이 휩쓰는 대지 위, 첫 숨을 내쉰 아이는 테라의 바람을 배운다.'
    };
  } else if (age < 30) {
    return {
      num: 2,
      title: '제2장: 광야(曠野)의 갈림길',
      subtitle: '15세 ~ 29세 · 청년의 방랑과 칼날',
      quote: '세상의 모순과 국가의 법도가 청년의 어깨를 짓누르니, 스스로의 깃발을 세워야 한다.'
    };
  } else if (age < 50) {
    return {
      num: 3,
      title: '제3장: 풍운(風雲)의 장막',
      subtitle: '30세 ~ 49세 · 장년의 중책과 격동',
      quote: '쌓아 올린 명성과 상처가 교차하는 계절. 대지의 격랑 속에서 자신의 자리를 지킨다.'
    };
  } else {
    return {
      num: 4,
      title: '제4장: 황혼(黃昏)의 여정',
      subtitle: '50세 이상 · 노년의 지혜와 종장',
      quote: '모든 오리지늄의 박동과 지나온 발자국이 황혼의 석양 아래 기록으로 응결된다.'
    };
  }
};

export const EventLogPanel: React.FC<Props> = ({
  logs,
  currentEvent,
  character,
  nationId,
  onSelectChoice,
  autoChoicePendingId,
  minorTimeoutRemainingSec,
  isPlaying,
  onNextYear,
  onSkipToNextEvent,
  onTogglePlay,
  onFlowThroughEvent,
  theme
}) => {
  const activeNationId = useMemo(() => {
    return nationId || resolveNationId(character?.nation);
  }, [nationId, character?.nation]);

  const nationIdentity = useMemo(() => {
    return getNationVisualIdentity(activeNationId);
  }, [activeNationId]);

  const logContainerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<LogFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const isPrts = theme === 'prts';

  // WCAG AA 고명도 텍스트 자동 판정 (저휘도 primary 국가: 이베리아, 시라쿠사, 빅토리아, 염국, 카즈델)
  const isDarkPrimary = useMemo(() => {
    if (!isPrts) return false;
    const darkNationIds = ['iberia', 'siracusa', 'victoria', 'yan', 'kazdel'];
    if (darkNationIds.includes(nationIdentity.id)) return true;
    const hex = (nationIdentity.colors.primary || '').replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16) || 0;
    const g = parseInt(hex.slice(2, 4), 16) || 0;
    const b = parseInt(hex.slice(4, 6), 16) || 0;
    const rs = r / 255; const gs = g / 255; const bs = b / 255;
    const rL = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const gL = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const bL = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
    const lum = 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
    return (lum + 0.05) / 0.05 < 4.5;
  }, [isPrts, nationIdentity.id, nationIdentity.colors.primary]);

  const handleScroll = () => {
    if (!logContainerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = logContainerRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 20;
    setIsAtBottom(atBottom);
  };

  const scrollToBottom = () => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      setIsAtBottom(true);
    }
  };

  const filteredLogs = logs.filter(entry => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchText = (entry.text || '').toLowerCase().includes(q) || (entry.title || '').toLowerCase().includes(q);
      const matchYear = String(entry.year).includes(q) || String(entry.age).includes(q);
      if (!matchText && !matchYear) return false;
    }
    if (filter === 'all') return true;
    if (filter === 'event') return entry.type === 'critical' || !!entry.rollDetails || entry.title.includes('【판정') || entry.title.includes('【업적') || entry.title.includes('【특수 직군') || entry.title.includes('【직급') || entry.title.includes('【생애 목표');
    if (filter === 'news') return entry.type === 'news';
    if (filter === 'combat') return entry.type === 'battle' || entry.type === 'hazard';
    if (filter === 'oripathy') return entry.type === 'oripathy' || entry.title.includes('광석병') || entry.title.includes('억제제');
    return true;
  });

  useEffect(() => {
    if (isAtBottom && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, currentEvent, filter, searchQuery, isAtBottom]);

  const getLogBadge = (type: LogEntry['type']) => {
    switch (type) {
      case 'news':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Radio className="w-3 h-3" />
            <span>속보</span>
          </span>
        );
      case 'hazard':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>경보</span>
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3 h-3" />
            <span>주요성취</span>
          </span>
        );
      case 'battle':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Sword className="w-3 h-3" />
            <span>전투</span>
          </span>
        );
      case 'oripathy':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            <span>광석병</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getEffectBadgeStyle = (badge: string) => {
    const isNegative = badge.includes('-') && !badge.includes('결정화 -');
    const isOripathyBad = badge.includes('결정화 +') || badge.includes('감염') || badge.includes('확진');
    const isLmd = badge.includes('LMD') || badge.includes('급여') || badge.includes('보수');
    const isSpecial = badge.includes('업적') || badge.includes('직군') || badge.includes('칭호') || badge.includes('목표') || badge.includes('직급');

    if (isSpecial) {
      return isPrts
        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
        : 'bg-purple-900/15 text-purple-900 border-purple-800/30';
    }
    if (isOripathyBad || isNegative) {
      return isPrts
        ? 'bg-red-500/15 text-red-300 border-red-500/30'
        : 'bg-red-900/15 text-red-900 border-red-800/30';
    }
    if (isLmd) {
      return isPrts
        ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
        : 'bg-amber-900/15 text-amber-900 border-amber-800/30';
    }
    return isPrts
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      : 'bg-emerald-900/15 text-emerald-900 border-emerald-800/30';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Filter Bar */}
      <div className={`px-3 sm:px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 shrink-0 ${
        isPrts ? 'bg-[#0e121a] border-cyan-500/20' : 'bg-[#e8dcbe] border-[#5c4033]/30'
      }`}>
        <div className="flex items-center space-x-1.5 text-[11px] shrink-0">
          <Filter className={`w-3.5 h-3.5 ${isPrts ? 'text-cyan-400' : 'text-[#8b1e1e]'}`} />
          <span className="font-bold opacity-75 hidden sm:inline">일지 필터:</span>
        </div>
        <div className="flex items-center space-x-1 shrink-0 overflow-x-auto py-0.5">
          {[
            { id: 'all', label: `전체 (${logs.length})` },
            { id: 'event', label: '주요 사건·판정' },
            { id: 'news', label: '세계 속보' },
            { id: 'combat', label: '전투·경보' },
            { id: 'oripathy', label: '광석병' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as LogFilter)}
              style={
                filter === tab.id && isPrts
                  ? { 
                      backgroundColor: nationIdentity.colors.primary, 
                      color: isDarkPrimary ? '#ffffff' : '#000000',
                      boxShadow: `0 0 10px ${nationIdentity.colors.primaryGlow}` 
                    }
                  : undefined
              }
              className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-all ${
                filter === tab.id
                  ? isPrts
                    ? `${isDarkPrimary ? 'text-white' : 'text-black'} shadow`
                    : 'bg-[#8b1e1e] text-white shadow'
                  : isPrts
                    ? 'text-slate-400 hover:text-white bg-slate-900/60'
                    : 'text-[#5c4d47] hover:text-black bg-[#f4ebd0]/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex items-center shrink-0">
          <Search className={`w-3 h-3 absolute left-2 ${isPrts ? 'text-cyan-400' : 'text-[#8b1e1e]'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="연도/내용 검색..."
            aria-label="로그 검색"
            className={`text-[11px] pl-6 pr-2 py-0.5 rounded border outline-none transition-all w-28 sm:w-36 ${
              isPrts
                ? 'bg-slate-900/80 border-cyan-500/30 text-cyan-200 placeholder-slate-500 focus:border-cyan-400'
                : 'bg-[#fbf7ed] border-[#5c4033]/40 text-[#1a1412] placeholder-[#8c7b75] focus:border-[#8b1e1e]'
            }`}
          />
        </div>
      </div>

      {/* Scrollable Story Logs */}
      <div className="relative grow flex flex-col min-h-0">
        <div
          ref={logContainerRef}
          onScroll={handleScroll}
          className="grow overflow-y-auto space-y-2.5 p-3.5 sm:p-4 pr-2 font-mono scroll-smooth"
        >
          {filteredLogs.map((entry, idx) => {
            const isRoutine = entry.title?.includes('테라의 일상');
            const chapter = getChapterForAge(entry.age);
            const prevEntry = idx > 0 ? filteredLogs[idx - 1] : null;
            const isFirstOfChapter = filter === 'all' && !searchQuery.trim() && (!prevEntry || getChapterForAge(prevEntry.age).num !== chapter.num);

            return (
              <React.Fragment key={entry.id}>
                {isFirstOfChapter && (
                  <div 
                    className={`my-3 py-2 px-3.5 rounded-lg border flex items-center justify-between text-xs transition-all ${
                      isPrts
                        ? 'bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 border-cyan-500/40 text-cyan-200 shadow-sm'
                        : 'bg-gradient-to-r from-[#ebdcb9] via-[#f5e8cc] to-[#ebdcb9] border-[#5c4033]/40 text-[#422006] shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold tracking-wider text-xs sm:text-[13px]">{chapter.title}</span>
                      <span className="text-[10px] sm:text-[11px] opacity-75">{chapter.subtitle}</span>
                    </div>
                    <span 
                      className="hidden sm:inline text-[10px] italic opacity-70 max-w-[280px] text-right truncate" 
                      title={chapter.quote}
                    >
                      "{chapter.quote}"
                    </span>
                  </div>
                )}

                <div
                  style={
                    isRoutine
                      ? { borderLeftColor: isPrts ? nationIdentity.colors.primary : '#8b1e1e', borderLeftWidth: '3px' }
                      : isPrts && (character?.nation && entry.title?.includes(character.nation))
                      ? { borderLeftColor: nationIdentity.colors.primary, borderLeftWidth: '3px' }
                      : undefined
                  }
                  className={`p-3.5 rounded-lg border text-[13.5px] sm:text-sm leading-relaxed transition-all ${
                    isRoutine
                      ? isPrts
                        ? 'bg-slate-900/30 border-slate-800/60 text-slate-300 italic'
                        : 'bg-[#fbf7ed]/60 border-[#5c4033]/20 text-[#2c1810] italic'
                      : entry.type === 'hazard'
                      ? isPrts ? 'bg-red-950/20 border-red-500/40 text-red-200' : 'bg-red-100 border-red-700 text-red-950'
                      : entry.type === 'critical'
                      ? isPrts ? 'bg-purple-950/20 border-purple-500/40 text-purple-200' : 'bg-purple-100 border-purple-700 text-purple-950'
                      : entry.type === 'news'
                      ? isPrts ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' : 'bg-amber-100 border-amber-700 text-amber-950'
                      : entry.type === 'battle'
                      ? isPrts ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' : 'bg-rose-100 border-rose-700 text-rose-950'
                      : isPrts
                      ? 'bg-slate-900/40 border-slate-800/80 text-slate-300'
                      : 'bg-[#f0e4c6] border-[#5c4033]/25 text-[#1a1412]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span 
                        className="text-[10px] sm:text-[11px] font-bold opacity-90"
                        style={{ color: isPrts ? nationIdentity.colors.badgeText : '#8b1e1e' }}
                      >
                        [{entry.year}년{entry.season ? ` ${entry.season}` : ''} · {entry.age}세]
                      </span>
                      <span className="font-bold text-xs sm:text-[13px]">{entry.title}</span>
                    </div>
                    {getLogBadge(entry.type)}
                  </div>

                  <p className="whitespace-pre-line opacity-90">{entry.text}</p>

                  {/* Stat / LMD / Effect Delta Badges */}
                  {entry.effectBadges && entry.effectBadges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-1.5 border-t border-white/5">
                      {entry.effectBadges.map((badge, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded border font-extrabold ${getEffectBadgeStyle(badge)}`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {entry.rollDetails && (
                    <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] ${
                      isPrts ? 'border-white/10 text-cyan-300' : 'border-[#5c4033]/20 text-[#8b1e1e]'
                    }`}>
                      <span className="flex items-center space-x-1">
                        <Dices className="w-3.5 h-3.5" />
                        <span>
                          판정: {entry.rollDetails.stat.toUpperCase()} | 주사위 {entry.rollDetails.roll} + 보정 = {entry.rollDetails.total} (목표: {entry.rollDetails.dc})
                        </span>
                      </span>
                      <span className="font-bold underline">
                        결과: {entry.rollDetails.result}
                      </span>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Floating Return to Bottom Button */}
        {!isAtBottom && (
          <button
            onClick={scrollToBottom}
            className={`absolute bottom-3 right-5 z-20 px-3 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center space-x-1.5 transition-all duration-200 animate-bounce ${
              isPrts
                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/30'
                : 'bg-[#8b1e1e] hover:bg-[#a32828] text-white shadow-stone-800/40'
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>최신 로그 보기 ↓</span>
          </button>
        )}
      </div>

      {/* Current Active Choice Decision Panel */}
      {currentEvent && character.isAlive && (
        <div className={`shrink-0 p-4 border-t shadow-2xl transition-all ${
          isPrts
            ? 'bg-[#0d1017] border-cyan-500/30 text-slate-100 font-mono'
            : 'bg-[#ebdcb9] border-[#5c4033] text-[#1a1412] font-serif'
        }`}>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <span 
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: isPrts ? nationIdentity.colors.primary : '#8b1e1e' }}
              />
              <span 
                className={`text-xs font-bold tracking-widest ${isPrts ? '' : 'text-[#8b1e1e]'}`}
                style={isPrts ? { color: nationIdentity.colors.badgeText } : undefined}
              >
                【운명의 갈림길】 {currentEvent.title}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {!currentEvent.isMajor && onFlowThroughEvent && (
                <button
                  type="button"
                  onClick={onFlowThroughEvent}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                    isPrts
                      ? 'bg-slate-800/90 hover:bg-slate-700 border-cyan-500/50 text-cyan-300 shadow-sm'
                      : 'bg-[#f4ebd0] hover:bg-[#faeed2] border-[#5c4033] text-[#2c1810]'
                  }`}
                  title="생존/안정 지향 선택지로 신속하게 흘려보내기 (단축키: 0)"
                >
                  <span>[0] 흘려보내기</span>
                </button>
              )}
              {typeof minorTimeoutRemainingSec === 'number' && minorTimeoutRemainingSec > 0 && (
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                  isPrts
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                    : 'bg-amber-900/15 border-amber-800/40 text-amber-950'
                }`}>
                  <Clock className="w-3 h-3" />
                  <span>자동 넘김 {minorTimeoutRemainingSec}초</span>
                </span>
              )}
            </div>
          </div>

          <p className="text-xs mb-3 leading-relaxed opacity-90">
            {currentEvent.description}
          </p>

          {/* Choices Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {currentEvent.choices.map((choice) => {
              const isAutoPending = choice.id === autoChoicePendingId;
              const reqCheck = GameEngine.checkChoiceRequirements(character, choice);
              const isDisabled = !reqCheck.allowed;

              return (
                <button
                  key={choice.id}
                  disabled={isDisabled}
                  onClick={() => !isDisabled && onSelectChoice(choice)}
                  style={
                    !isDisabled && isAutoPending && isPrts
                      ? {
                          borderColor: nationIdentity.colors.primary,
                          boxShadow: `0 0 15px ${nationIdentity.colors.primaryGlow}`
                        }
                      : undefined
                  }
                  className={`p-3 rounded-lg border text-left transition-all group flex flex-col justify-between relative ${
                    isDisabled
                      ? isPrts
                        ? 'bg-slate-950/60 border-slate-800/70 text-slate-500 cursor-not-allowed opacity-65'
                        : 'bg-[#e3d7ba]/70 border-[#5c4033]/20 text-[#7d6f68] cursor-not-allowed opacity-70'
                      : isAutoPending
                        ? isPrts
                          ? 'bg-cyan-950/80 ring-2 ring-cyan-400/50 animate-pulse'
                          : 'bg-[#faecd0] border-[#8b1e1e] ring-2 ring-[#8b1e1e]/40 shadow-[0_0_12px_rgba(139,30,30,0.3)]'
                        : isPrts
                          ? 'bg-slate-900/80 border-slate-700 hover:border-nation-primary hover:shadow-nation-glow hover:bg-slate-800'
                          : 'bg-[#f4ebd0] border-[#5c4033]/40 hover:border-[#8b1e1e] hover:bg-[#faeed2]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-xs transition-colors flex items-center flex-wrap gap-1.5 ${
                        !isDisabled ? (isPrts ? 'group-hover:text-nation-badge-text' : 'group-hover:text-[#8b1e1e]') : ''
                      }`}>
                        <span>{choice.label}</span>
                        {isAutoPending && (
                          <span 
                            className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold flex items-center space-x-1 ${
                              isPrts ? (isDarkPrimary ? 'text-white' : 'text-black') : 'bg-[#8b1e1e] text-white'
                            }`}
                            style={
                              isPrts 
                                ? { 
                                    backgroundColor: nationIdentity.colors.primary,
                                    color: isDarkPrimary ? '#ffffff' : '#000000'
                                  } 
                                : undefined
                            }
                          >
                            <Bot className="w-2.5 h-2.5" />
                            <span>AI 자동 선택</span>
                          </span>
                        )}
                      </span>
                      {isDisabled ? (
                        <Lock className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      ) : (
                        <ChevronRight className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                    <p className="text-[11px] opacity-75 leading-normal mb-2">
                      {choice.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-white/5 text-[10px]">
                    {choice.diceCheck && (
                      <span className={`flex items-center space-x-1 font-bold ${isPrts ? 'text-amber-400' : 'text-[#8b1e1e]'}`}>
                        <Dices className="w-3 h-3" />
                        <span>{choice.diceCheck.stat.toUpperCase()} 판정 (DC {choice.diceCheck.difficulty})</span>
                      </span>
                    )}
                    {isDisabled && reqCheck.reason && (
                      <span className="text-red-400 font-bold">
                        조건 미충족: {reqCheck.reason}
                      </span>
                    )}
                    {!isDisabled && choice.requirements?.lmdCost && (
                      <span className={isPrts ? 'text-yellow-300 font-bold' : 'text-amber-900 font-bold'}>
                        소모: {choice.requirements.lmdCost.toLocaleString()} LMD
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Progress Prompt Banner when Paused */}
      {!currentEvent && character.isAlive && !isPlaying && (
        <div className={`shrink-0 p-3.5 border-t flex flex-wrap items-center justify-between gap-2.5 transition-all ${
          isPrts 
            ? 'bg-[#0d1017]/95 border-cyan-500/30 text-slate-100 shadow-[0_-5px_15px_rgba(0,0,0,0.4)]' 
            : 'bg-[#ebdcb9] border-[#5c4033]/40 text-[#1a1412] shadow-md'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <div>
              <div className="text-xs font-bold flex items-center space-x-1.5">
                <span className="text-amber-400">【일시정지됨】</span>
                <span>테라력 {character.year}년 · {character.age}세</span>
              </div>
              <p className="text-[11px] opacity-70">
                시간이 멈춰 있습니다. 다음 해로 진행하거나 자동진행을 시작하세요.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {onTogglePlay && (
              <button
                onClick={onTogglePlay}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow ${
                  isPrts 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30' 
                    : 'bg-[#2d5a27] hover:bg-[#386d30] text-white'
                }`}
                title="자동 진행 재개 (Space)"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>자동진행 시작</span>
              </button>
            )}

            {onNextYear && (
              <button
                onClick={onNextYear}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border shadow ${
                  isPrts 
                    ? 'bg-slate-800 hover:bg-slate-700 border-cyan-500/50 text-cyan-300' 
                    : 'bg-[#f4ebd0] hover:bg-[#faeed2] border-[#5c4033] text-[#2c1810]'
                }`}
                title="다음 해로 1년 진행 (N)"
              >
                <span>+1년 진행</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {onSkipToNextEvent && (
              <button
                onClick={onSkipToNextEvent}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border shadow ${
                  isPrts 
                    ? 'bg-indigo-950/90 hover:bg-indigo-900 border-indigo-500/60 text-indigo-300' 
                    : 'bg-[#c99732] hover:bg-[#dba83f] border-[#5c4033] text-black'
                }`}
                title="다음 사건이나 선택지가 나올 때까지 직행 (S)"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>사건까지 스킵</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
