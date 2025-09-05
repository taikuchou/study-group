import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Calendar, BookOpen, MessageSquare, Link, FileText, 
  Heart, Lightbulb, Plus, Edit, Trash2, Search, Filter,
  ChevronDown, ChevronRight, Settings, Shield, User as UserIcon, RefreshCw
} from 'lucide-react';
  import type { User, Topic, Interaction } from '../types';
  // import { mockUsers, mockTopics, mockInteractions } from '../data/mockData';
import TopicList from './TopicList';
import SessionDetail from './SessionDetail';
import UserManagement from './UserManagement';
import { useData } from '../context/DataContext';
const StudyGroupPlatform = () => {
  // 模擬數據狀態
  // const [currentUser, setCurrentUser] = useState({
  //   id: 1,
  //   name: "Alice Chen",
  //   email: "alice@example.com",
  //   role: "admin",
  //   createdAt: "2024-01-15",
  // });
  const [activeTab, setActiveTab] = useState('topics');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [currentTopicForSession, setCurrentTopicForSession] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  // 模擬數據
  const { currentUser, setCurrentUser, users, topics, interactions, loading, error, reload, createUser, updateUser, deleteUser, createTopic, updateTopic, deleteTopic, createInteraction } = useData();

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserSwitcher && !event.target.closest('.user-switcher')) {
        setShowUserSwitcher(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserSwitcher]);

  // const [users] = useState<User[]>(mockUsers);
  // const [topics, setTopics] = useState<Topic[]>(mockTopics);
  // const [interactions, setInteractions] = useState<Interaction[]>(mockInteractions);

  // 篩選邏輯
  const filteredTopics = useMemo(() => {
    if (!searchQuery) return topics;
    return topics.filter(topic => 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      topic.outline.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [topics, searchQuery]);

  // 獲取使用者名稱
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // 獲取特定 session 的互動內容
  const getSessionInteractions = (sessionId) => {
    return interactions.filter(item => item.sessionId === sessionId);
  };

  // 互動類型圖標和標籤
  const getInteractionIcon = (type) => {
    const icons = {
      question: <MessageSquare className="w-4 h-4" />,
      noteLink: <Link className="w-4 h-4" />,
      reference: <FileText className="w-4 h-4" />,
      speakerFeedback: <Heart className="w-4 h-4" />,
      weeklyInsight: <Lightbulb className="w-4 h-4" />,
      outlineSuggestion: <Edit className="w-4 h-4" />
    };
    return icons[type] || <FileText className="w-4 h-4" />;
  };

  const getInteractionLabel = (type) => {
    const labels = {
      question: '提問',
      noteLink: '筆記連結',
      reference: '參考資料',
      speakerFeedback: '對分享者建議',
      weeklyInsight: '本週心得',
      outlineSuggestion: '分享大綱建議'
    };
    return labels[type] || type;
  };

  // 切換主題展開狀態
  const toggleTopicExpansion = (topicId) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  // 添加新互動內容
  const addInteraction = (type, sessionId, content, additionalData = {}) => {
    const newInteraction = {
      id: interactions.length + 1,
      type,
      sessionId,
      authorId: currentUser.id,
      content,
      ...additionalData,
      createdAt: new Date().toISOString()
    };
    createInteraction(newInteraction);
  };

  // 切換使用者身份（測試用）
  const switchUser = (user) => {
    setCurrentUser(user);
    setShowUserSwitcher(false);
    // 重置一些狀態
    setActiveTab('topics');
    setSelectedTopic(null);
    setSelectedSession(null);
  };

  // 刪除場次
  const handleDeleteSession = async (session) => {
    if (!selectedTopic) return;
    
    if (window.confirm(`確定要刪除場次「${session.scope}」嗎？此操作無法復原。`)) {
      const updatedTopic = {
        ...selectedTopic,
        sessions: selectedTopic.sessions.filter(s => s.id !== session.id)
      };
      
      await updateTopic(updatedTopic);
      setActiveTab('topics'); // 回到主題列表
    }
  };

  // 簡單的模態框組件
  const renderModal = () => {
    if (!showModal) return null;

    const modalContent = {
      newQuestion: {
        title: '新增提問',
        fields: [
          { key: 'content', label: '問題內容', type: 'textarea', placeholder: '請輸入您的問題...' }
        ]
      },
      newNoteLink: {
        title: '新增筆記連結',
        fields: [
          { key: 'label', label: '連結標題', type: 'text', placeholder: '例：React Hooks 學習筆記' },
          { key: 'description', label: '描述', type: 'textarea', placeholder: '簡短描述這個連結的內容...' },
          { key: 'url', label: '連結網址', type: 'url', placeholder: 'https://...' }
        ]
      },
      newInsight: {
        title: '新增本週心得',
        fields: [
          { key: 'content', label: '心得內容', type: 'textarea', placeholder: '分享您本週的學習心得...' }
        ]
      },
      newFeedback: {
        title: '對分享者建議',
        fields: [
          { key: 'content', label: '建議內容', type: 'textarea', placeholder: '給分享者的建議或回饋...' }
        ]
      },
      newReference: {
        title: '新增參考資料',
        fields: [
          { key: 'content', label: '參考資料', type: 'textarea', placeholder: '請輸入參考資料內容或連結...' }
        ]
      },
      newTopic: {
        title: '新增主題',
        fields: [
          { key: 'title', label: '主題標題', type: 'text', placeholder: '請輸入主題標題', required: true },
          { key: 'startDate', label: '開始日期', type: 'date', required: true },
          { key: 'endDate', label: '結束日期', type: 'date', required: true },
          { key: 'intervalType', label: '間隔類型', type: 'select', options: [
            { value: 'WEEKLY', label: '每週' },
            { value: 'BIWEEKLY', label: '隔週' }
          ], required: true },
          { key: 'outline', label: '主題大綱', type: 'textarea', placeholder: '請描述主題內容大綱...', required: true },
          { key: 'keywords', label: '關鍵字', type: 'text', placeholder: '用逗號分隔，例：React, JavaScript, Frontend' },
          { key: 'referenceUrls', label: '參考連結', type: 'textarea', placeholder: '每行一個連結\nhttps://example1.com\nhttps://example2.com' },
          { key: 'attendees', label: '參與者', type: 'multiselect', options: users.map(u => ({ value: u.id, label: u.name })), required: true }
        ]
      },
      editTopic: {
        title: '編輯主題',
        fields: [
          { key: 'title', label: '主題標題', type: 'text', placeholder: '請輸入主題標題', required: true },
          { key: 'startDate', label: '開始日期', type: 'date', required: true },
          { key: 'endDate', label: '結束日期', type: 'date', required: true },
          { key: 'intervalType', label: '間隔類型', type: 'select', options: [
            { value: 'WEEKLY', label: '每週' },
            { value: 'BIWEEKLY', label: '隔週' }
          ], required: true },
          { key: 'outline', label: '主題大綱', type: 'textarea', placeholder: '請描述主題內容大綱...', required: true },
          { key: 'keywords', label: '關鍵字', type: 'text', placeholder: '用逗號分隔，例：React, JavaScript, Frontend' },
          { key: 'referenceUrls', label: '參考連結', type: 'textarea', placeholder: '每行一個連結\nhttps://example1.com\nhttps://example2.com' },
          { key: 'attendees', label: '參與者', type: 'multiselect', options: users.map(u => ({ value: u.id, label: u.name })), required: true }
        ]
      },
      newSession: {
        title: '新增場次',
        fields: [
          { key: 'scope', label: '場次主題', type: 'text', placeholder: '請輸入場次主題或範圍', required: true },
          { key: 'startDateTime', label: '開始時間', type: 'datetime-local', required: true },
          { key: 'presenterId', label: '分享者', type: 'select', options: users.map(u => ({ value: u.id, label: u.name })), required: true },
          { key: 'outline', label: '場次大綱', type: 'textarea', placeholder: '請描述本場次的詳細內容...', required: true },
          { key: 'attendees', label: '出席者', type: 'multiselect', options: users.map(u => ({ value: u.id, label: u.name })), required: false }
        ]
      },
      editSession: {
        title: '編輯場次',
        fields: [
          { key: 'scope', label: '場次主題', type: 'text', placeholder: '請輸入場次主題或範圍', required: true },
          { key: 'startDateTime', label: '開始時間', type: 'datetime-local', required: true },
          { key: 'presenterId', label: '分享者', type: 'select', options: users.map(u => ({ value: u.id, label: u.name })), required: true },
          { key: 'outline', label: '場次大綱', type: 'textarea', placeholder: '請描述本場次的詳細內容...', required: true },
          { key: 'attendees', label: '出席者', type: 'multiselect', options: users.map(u => ({ value: u.id, label: u.name })), required: false }
        ]
      },
      newUser: {
        title: '新增使用者',
        fields: [
          { key: 'name', label: '使用者姓名', type: 'text', placeholder: '請輸入使用者姓名', required: true },
          { key: 'email', label: '電子郵件', type: 'email', placeholder: '請輸入電子郵件地址', required: true },
          { key: 'role', label: '使用者角色', type: 'select', options: [
            { value: 'user', label: '一般使用者' },
            { value: 'admin', label: '管理員' }
          ], required: true }
        ]
      },
      editUser: {
        title: '編輯使用者',
        fields: [
          { key: 'name', label: '使用者姓名', type: 'text', placeholder: '請輸入使用者姓名', required: true },
          { key: 'email', label: '電子郵件', type: 'email', placeholder: '請輸入電子郵件地址', required: true },
          { key: 'role', label: '使用者角色', type: 'select', options: [
            { value: 'user', label: '一般使用者' },
            { value: 'admin', label: '管理員' }
          ], required: true }
        ]
      }
    };

    const config = modalContent[showModal];
    if (!config) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {};
      
      config.fields.forEach(field => {
        if (field.type === 'select' && field.key === 'presenterId') {
          data[field.key] = parseInt(formData.get(field.key));
        } else if (field.key === 'keywords') {
          data[field.key] = formData.get(field.key) ? formData.get(field.key).split(',').map(k => k.trim()) : [];
        } else if (field.key === 'referenceUrls') {
          data[field.key] = formData.get(field.key) ? formData.get(field.key).split('\n').filter(url => url.trim()) : [];
        } else if (field.type === 'multiselect' && field.key === 'attendees') {
          // 處理多選attendees欄位
          const selectedAttendees = formData.getAll(field.key);
          data[field.key] = selectedAttendees.map(id => parseInt(id));
        } else {
          data[field.key] = formData.get(field.key);
        }
      });

      // 根據不同的模態框類型處理數據
      if (showModal === 'newTopic') {
        const newTopic = {
          id: topics.length + 1,
          ...data,
          createdBy: currentUser.id,
          createdAt: new Date().toISOString(),
          sessions: []
        };
        createTopic(newTopic);
      } else if (showModal === 'editTopic' && editingTopic) {
        const updatedTopic = {
          ...editingTopic,
          ...data
        };
        updateTopic(updatedTopic);
        setEditingTopic(null);
      } else if (showModal === 'newSession' && currentTopicForSession) {
        const newSession = {
          id: Math.max(0, ...currentTopicForSession.sessions.map(s => s.id)) + 1,
          topicId: currentTopicForSession.id,
          presenterId: parseInt(data.presenterId),
          startDateTime: data.startDateTime,
          scope: data.scope,
          outline: data.outline,
          noteLinks: [],
          references: [],
          attendees: data.attendees || []
        };
        
        const updatedTopic = {
          ...currentTopicForSession,
          sessions: [...currentTopicForSession.sessions, newSession]
        };
        
        updateTopic(updatedTopic);
        setCurrentTopicForSession(null);
      } else if (showModal === 'editSession' && editingSession && selectedTopic) {
        const updatedSession = {
          ...editingSession,
          presenterId: parseInt(data.presenterId),
          startDateTime: data.startDateTime,
          scope: data.scope,
          outline: data.outline,
          attendees: data.attendees || []
        };
        
        const updatedTopic = {
          ...selectedTopic,
          sessions: selectedTopic.sessions.map(s => s.id === editingSession.id ? updatedSession : s)
        };
        
        updateTopic(updatedTopic);
        setEditingSession(null);
      } else if (showModal === 'newUser') {
        const newUser = {
          id: users.length + 1,
          ...data,
          createdAt: new Date().toISOString()
        };
        createUser(newUser);
      } else if (showModal === 'editUser' && editingUser) {
        const updatedUser = {
          ...editingUser,
          ...data
        };
        updateUser(updatedUser);
        setEditingUser(null);
      } else {
        // 新增互動內容
        let interactionType;
        if (showModal === 'newInsight') {
          interactionType = 'weeklyInsight';
        } else if (showModal === 'newNoteLink') {
          interactionType = 'noteLink';
        } else if (showModal === 'newQuestion') {
          interactionType = 'question';
        } else if (showModal === 'newReference') {
          interactionType = 'reference';
        } else if (showModal === 'newFeedback') {
          interactionType = 'speakerFeedback';
        } else {
          // 備案：使用原來的邏輯
          interactionType = showModal.replace('new', '').toLowerCase();
        }
        
        addInteraction(interactionType, selectedSession?.id, data.content, data);
      }
      
      setShowModal(null);
    };

    // 獲取預填值（編輯模式）
    const getDefaultValue = (field) => {
      // 編輯主題模式
      if (editingTopic && showModal === 'editTopic') {
        console.log('取得主題預設值:', field.key, editingTopic[field.key]);
        
        if (field.key === 'keywords') {
          return editingTopic.keywords ? editingTopic.keywords.join(', ') : '';
        } else if (field.key === 'referenceUrls') {
          return editingTopic.referenceUrls ? editingTopic.referenceUrls.join('\n') : '';
        } else if (field.key === 'attendees') {
          return editingTopic.attendees || [];
        }
        return editingTopic[field.key] || '';
      }
      
      // 新增主題模式 - 預設選中當前使用者
      if (showModal === 'newTopic' && field.key === 'attendees') {
        return [currentUser.id];
      }
      
      // 編輯場次模式
      if (editingSession && showModal === 'editSession') {
        console.log('取得場次預設值:', field.key, editingSession[field.key]);
        
        if (field.key === 'presenterId') {
          return editingSession.presenterId || '';
        } else if (field.key === 'attendees') {
          return editingSession.attendees || [];
        }
        return editingSession[field.key] || '';
      }
      
      // 編輯使用者模式
      if (editingUser && showModal === 'editUser') {
        console.log('取得使用者預設值:', field.key, editingUser[field.key]);
        return editingUser[field.key] || '';
      }
      
      return '';
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">{config.title}</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {config.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.key}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={field.placeholder}
                      rows={3}
                      required={field.required}
                      defaultValue={getDefaultValue(field)}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.key}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={field.required}
                      defaultValue={getDefaultValue(field)}
                    >
                      <option value="">請選擇...</option>
                      {field.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'multiselect' ? (
                    <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                      {field.options?.map(option => (
                        <label key={option.value} className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            name={field.key}
                            value={option.value}
                            defaultChecked={getDefaultValue(field).includes(parseInt(option.value))}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      name={field.key}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={field.placeholder}
                      required={field.required}
                      defaultValue={getDefaultValue(field)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {showModal === 'editTopic' || showModal === 'editSession' || showModal === 'editUser' ? '確認修改' : '確認新增'}
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                onClick={() => {
                  setShowModal(null);
                  setEditingTopic(null);
                  setCurrentTopicForSession(null);
                  setEditingSession(null);
                  setEditingUser(null);
                }}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 頂部導航 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">共學平台</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 身份切換下拉選單（測試用） */}
              <div className="relative user-switcher">
                <button
                  onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 border border-yellow-300"
                  title="測試用：切換使用者身份"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">測試切換</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                {showUserSwitcher && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                    <div className="py-1">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b">
                        切換身份 (測試用)
                      </div>
                      {users.map(user => (
                        <button
                          key={user.id}
                          onClick={() => switchUser(user)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 ${
                            currentUser.id === user.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            {user.role === 'admin' ? (
                              <Shield className="w-3 h-3 text-blue-600" />
                            ) : (
                              <UserIcon className="w-3 h-3 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">
                              {user.role === 'admin' ? '管理者' : '使用者'} • {user.email}
                            </div>
                          </div>
                          {currentUser.id === user.id && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 當前使用者顯示 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  {currentUser.role === 'admin' ? (
                    <Shield className="w-4 h-4 text-blue-600" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
                  <span className="text-xs text-gray-500">{currentUser.role === 'admin' ? '管理者' : '使用者'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 標籤導航 */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('topics')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'topics'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            共學主題
          </button>
          
          <button
            onClick={() => setActiveTab('session')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'session'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            場次詳情
          </button>
          
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              使用者管理
            </button>
          )}
        </div>

        {/* 主要內容區域 */}
        <div className="transition-all duration-300">
          {activeTab === 'topics' && (
  <TopicList
    topics={topics}
    users={users}
    interactions={interactions}
    searchQuery={searchQuery}
    onSearch={setSearchQuery}
    expandedTopicIds={expandedTopics}
    onToggleTopic={toggleTopicExpansion}
    currentUserRole={currentUser.role as 'admin' | 'user'}
    onNewTopic={() => setShowModal('newTopic')}
    onNewSession={(topic) => {
      setCurrentTopicForSession(topic);
      setShowModal('newSession');
    }}
    onOpenSession={(topic, session) => {
      setSelectedTopic(topic);
      setSelectedSession(session);
      setActiveTab('session');
    }}
    onEditTopic={(t) => {
      setEditingTopic(t);
      setShowModal('editTopic');
    }}
    onDeleteTopic={(t) => {
      if (window.confirm(`確定要刪除主題「${t.title}」嗎？此操作無法復原。`)) {
        deleteTopic(t.id);
      }
    }}
  />
)}

 {activeTab === 'session' && selectedTopic && selectedSession && (
  <SessionDetail
    topic={selectedTopic}
    session={selectedSession}
    users={users}
    interactions={interactions.filter(i => i.sessionId === selectedSession.id)}
    onBack={() => setActiveTab('topics')}
    onEditSession={(s) => {
      setEditingSession(s);
      setShowModal('editSession');
    }}
    onDeleteSession={handleDeleteSession}
    onAddNoteLink={() => setShowModal('newNoteLink')}
    onAddReference={() => setShowModal('newReference')}
    onAddQuestion={() => setShowModal('newQuestion')}
    onAddInsight={() => setShowModal('newInsight')}
    onAddSpeakerFeedback={() => setShowModal('newFeedback')}
  />
)}

  {activeTab === 'users' && currentUser.role === 'admin' && (
  <UserManagement
    users={users}
    currentUserRole={currentUser.role as 'admin' | 'user'}
    onCreateUser={() => setShowModal('newUser')}
    onEditUser={(u) => {
      setEditingUser(u);
      setShowModal('editUser');
    }}
    onDeleteUser={(u) => {
      if (window.confirm(`確定要刪除使用者「${u.name}」嗎？此操作無法復原。`)) {
        deleteUser(u.id);
      }
    }}
  />
)}

        </div>
      </div>

      {/* 模態框 */}
      {renderModal()}
    </div>
  );
};

export default StudyGroupPlatform;