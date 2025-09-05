import React, { useMemo, useState } from 'react';
import {
  Calendar, FileText, Link as LinkIcon, MessageSquare,
  Heart, Lightbulb, Edit, Trash2, User as UserIcon, ChevronLeft, Plus, Users, X, Check, X as XIcon
} from 'lucide-react';
import type { Topic, User, Interaction } from '../types';

type Session = Topic['sessions'][number];

type Props = {
  topic: Topic;
  session: Session;
  users: User[];
  interactions: Interaction[]; // 僅該 session 的互動（父元件先過濾）
  onBack: () => void;
  onEditSession?: (s: Session) => void;
  onDeleteSession?: (s: Session) => void;
  onAddNoteLink?: () => void;
  onAddReference?: () => void;
  onAddQuestion?: () => void;
  onAddInsight?: () => void;
  onAddSpeakerFeedback?: () => void;
};

const SessionDetail: React.FC<Props> = ({
  topic, session, users, interactions, onBack, onEditSession, onDeleteSession, onAddNoteLink, onAddReference, onAddQuestion, onAddInsight, onAddSpeakerFeedback
}) => {
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);

  const getUserName = (userId: number) =>
    users.find(u => u.id === userId)?.name ?? 'Unknown User';

  const byType = useMemo(() => {
    return {
      question: interactions.filter(i => i.type === 'question'),
      weeklyInsight: interactions.filter(i => i.type === 'weeklyInsight'),
      speakerFeedback: interactions.filter(i => i.type === 'speakerFeedback'),
      reference: interactions.filter(i => i.type === 'reference'),
      outlineSuggestion: interactions.filter(i => i.type === 'outlineSuggestion'),
      noteLink: interactions.filter(i => i.type === 'noteLink'),
    };
  }, [interactions]);

  return (
    <div className="space-y-6">
      {/* 返回與操作列 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
          返回主題
        </button>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-50"
            onClick={() => onEditSession?.(session)}
          >
            <Edit className="w-4 h-4 inline -mt-1 mr-1" /> 編輯場次
          </button>
          <button
            className="px-3 py-1 rounded border text-red-600 hover:bg-red-50"
            onClick={() => onDeleteSession?.(session)}
          >
            <Trash2 className="w-4 h-4 inline -mt-1 mr-1" /> 刪除
          </button>
        </div>
      </div>

      {/* 場次基本資訊 */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{session.scope}</h2>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {session.startDateTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <UserIcon className="w-4 h-4" />
            分享者：{getUserName(session.presenterId)}
          </span>
          <button 
            className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
            onClick={() => setShowAttendeesModal(true)}
          >
            <Users className="w-4 h-4" />
            出席：{session.attendees?.length || 0} 人
          </button>
          <span className="inline-flex items-center gap-1">
            <FileText className="w-4 h-4" /> 所屬主題：{topic.title}
          </span>
        </div>

        {session.outline && (
          <p className="mt-4 text-gray-700 leading-relaxed">{session.outline}</p>
        )}
      </div>

      {/* 筆記連結（Session.noteLinks + 互動 noteLink） */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            <h3 className="font-semibold text-gray-900">筆記連結</h3>
          </div>
          {onAddNoteLink && (
            <button
              onClick={onAddNoteLink}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              新增筆記連結
            </button>
          )}
        </div>
        {(session.noteLinks.length > 0 || byType.noteLink.length > 0) ? (
          <ul className="space-y-2">
            {session.noteLinks.map((url, idx) => (
              <li key={`s-notelink-${idx}`}>
                <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  {url}
                </a>
              </li>
            ))}
            {byType.noteLink.map((i: Interaction & { type: 'noteLink'; label: string; description: string; url: string; }) => (
              <li key={`i-notelink-${i.id}`}>
                <a href={i.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  {i.label}
                </a>
                {i.description && <span className="text-gray-500 ml-2">— {i.description}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">暫無筆記連結</p>
        )}
      </div>

      {/* 參考資料（Session.references + 互動 reference） */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <h3 className="font-semibold text-gray-900">參考資料</h3>
          </div>
          {onAddReference && (
            <button
              onClick={onAddReference}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              新增參考資料
            </button>
          )}
        </div>
        {(session.references.length > 0 || byType.reference.length > 0) ? (
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            {session.references.map((ref, idx) => (
              <li key={`s-ref-${idx}`}>{ref}</li>
            ))}
            {byType.reference.map((i) => (
              <li key={`i-ref-${i.id}`}>{(i as any).content}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">暫無參考資料</p>
        )}
      </div>

      {/* 問答 / 週記 / 講者回饋 / 大綱建議 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <h3 className="font-semibold">問題</h3>
            </div>
            {onAddQuestion && (
              <button
                onClick={onAddQuestion}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                <Plus className="w-3 h-3" />
                新增
              </button>
            )}
          </div>
          {byType.question.length > 0 ? (
            <ul className="space-y-2">
              {byType.question.map(q => (
                <li key={q.id} className="text-gray-800">{(q as any).content}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">暫無問題</p>
          )}
        </section>

        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <h3 className="font-semibold">本週洞見</h3>
            </div>
            {onAddInsight && (
              <button
                onClick={onAddInsight}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                <Plus className="w-3 h-3" />
                新增
              </button>
            )}
          </div>
          {byType.weeklyInsight.length > 0 ? (
            <ul className="space-y-2">
              {byType.weeklyInsight.map(w => (
                <li key={w.id} className="text-gray-800">{(w as any).content}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">暫無本週洞見</p>
          )}
        </section>

        <section className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <h3 className="font-semibold">講者回饋</h3>
            </div>
            {onAddSpeakerFeedback && (
              <button
                onClick={onAddSpeakerFeedback}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Plus className="w-3 h-3" />
                新增
              </button>
            )}
          </div>
          {byType.speakerFeedback.length > 0 ? (
            <ul className="space-y-2">
              {byType.speakerFeedback.map(f => (
                <li key={f.id} className="text-gray-800">{(f as any).content}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">暫無講者回饋</p>
          )}
        </section>

        {!!byType.outlineSuggestion.length && (
          <section className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4" />
              <h3 className="font-semibold">大綱建議</h3>
            </div>
            <ul className="space-y-2">
              {byType.outlineSuggestion.map(s => (
                <li key={s.id} className="text-gray-800">{(s as any).content}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* 出席者清單模態框 */}
      {showAttendeesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">場次出席狀況</h3>
              <button
                onClick={() => setShowAttendeesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <div className="font-medium text-gray-900">{session.scope}</div>
              <div className="text-sm text-gray-600">{session.startDateTime}</div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-gray-700 mb-3">
                主題成員出席狀況：
              </div>
              
              {topic.attendees.map(memberId => {
                const isAttended = session.attendees?.includes(memberId) || false;
                return (
                  <div key={memberId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isAttended ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        <span className={`text-sm font-medium ${
                          isAttended ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {getUserName(memberId)[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-900">{getUserName(memberId)}</span>
                    </div>
                    <div className="flex items-center">
                      {isAttended ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm">已出席</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <XIcon className="w-4 h-4" />
                          <span className="text-sm">未出席</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
              <div className="font-medium text-blue-800 mb-1">出席統計</div>
              <div className="text-blue-700">
                出席：{session.attendees?.length || 0} 人 / 
                總成員：{topic.attendees.length} 人 
                ({Math.round(((session.attendees?.length || 0) / topic.attendees.length) * 100)}%)
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAttendeesModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetail;
