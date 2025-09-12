import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import type { User, Topic, Session, Interaction } from '../types';
import type { DataService } from '../services/DataService';
import { MockDataService } from '../services/MockDataService';
import { ApiDataService } from '../services/ApiDataService';
import { canPerform, type Action, type Ownable } from './Ownership';



export type DataSource = 'api' | 'mock';

function resolveDefaultSource(): DataSource {
  const fromEnv = (import.meta.env.VITE_DATA_SOURCE ?? '').toLowerCase();
  console.log('resolveDefaultSource:', fromEnv);
  return fromEnv === 'api' ? 'api' : 'mock';
}
function serviceFrom(source: DataSource): DataService {
  console.log('serviceFrom:', source);
  return source === 'api' ? new ApiDataService() : new MockDataService();
}

type DataContextValue = {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;

  users: User[];
  topics: Topic[];
  sessions: Session[];
  interactions: Interaction[];

  loading: boolean;
  error: string | null;

  reload: () => Promise<void>;
  createUser: (u: User) => Promise<User>;
  updateUser: (u: User) => Promise<User>;
  deleteUser: (id: number) => Promise<void>;
  createTopic: (t: Topic) => Promise<Topic>;
  updateTopic: (t: Topic) => Promise<Topic>;
  deleteTopic: (id: number) => Promise<void>;
  createSession: (s: Session) => Promise<Session>;
  updateSession: (s: Session) => Promise<Session>;
  deleteSession: (id: number) => Promise<void>;
  createInteraction: (i: Interaction) => Promise<Interaction>;
  updateInteraction: (i: Interaction) => Promise<Interaction>;
  deleteInteraction: (id: number) => Promise<void>;

  can: (action: Action, target: Ownable) => boolean;
  OwnershipGuard: <P extends { ownerId?: number }>(
    props: React.PropsWithChildren<{ action: Action; target: Ownable; fallback?: React.ReactNode }>
  ) => JSX.Element;

  source: DataSource;
  setSource?: (s: DataSource) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

export const DataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [source, setSource] = useState<DataSource>(() => {
    //console.log('Initial source 0:', localStorage.getItem('dataSource'));
    const cached = (typeof window !== 'undefined') ? localStorage.getItem('dataSource') as DataSource | null : null;
    //console.log('Initial source:', cached);
    return cached ?? resolveDefaultSource();
  });
  useEffect(() => {
    
    if (typeof window !== 'undefined') localStorage.setItem('dataSource', source);
  }, [source]);

  const dataService: DataService = useMemo(() => serviceFrom(source), [source]);

  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: 'Alice Chen',
    email: 'alice@example.com',
    role: 'admin',
    createdAt: '2024-01-15',
  } as User);

  const [users, setUsers] = useState<User[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true); setError(null);
    try {
      const [u, t, s, inter] = await Promise.all([
        dataService.listUsers(), dataService.listTopics(), dataService.listSessions(), dataService.listInteractions()
      ]);
      setUsers(u); setTopics(t); setSessions(s); setInteractions(inter);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void reload(); }, [dataService]);

  const createUser = async (u: User) => {
    const created = await dataService.createUser(u);
    setUsers(prev => [...prev, created]);
    return created;
  };
  const updateUser = async (u: User) => {
    const updated = await dataService.updateUser(u);
    setUsers(prev => prev.map(x => (x.id === updated.id ? updated : x)));
    return updated;
  };
  const deleteUser = async (id: number) => {
    await dataService.deleteUser(id);
    setUsers(prev => prev.filter(x => x.id !== id));
  };

  const createTopic = async (t: Topic) => {
    const created = await dataService.createTopic(t);
    setTopics(prev => [...prev, created]);
    return created;
  };
  const updateTopic = async (t: Topic) => {
    const updated = await dataService.updateTopic(t);
    setTopics(prev => prev.map(x => (x.id === updated.id ? updated : x)));
    return updated;
  };
  const deleteTopic = async (id: number) => {
    await dataService.deleteTopic(id);
    setTopics(prev => prev.filter(x => x.id !== id));
  };

  const createSession = async (s: Session) => {
    const created = await dataService.createSession(s);
    setSessions(prev => [...prev, created]);
    return created;
  };
  const updateSession = async (s: Session) => {
    const updated = await dataService.updateSession(s);
    setSessions(prev => prev.map(x => (x.id === updated.id ? updated : x)));
    return updated;
  };
  const deleteSession = async (id: number) => {
    await dataService.deleteSession(id);
    setSessions(prev => prev.filter(x => x.id !== id));
  };

  const createInteraction = async (i: Interaction) => {
    const created = await dataService.createInteraction(i);
    setInteractions(prev => [...prev, created]);
    return created;
  };

  const updateInteraction = async (i: Interaction) => {
    const updated = await dataService.updateInteraction(i);
    setInteractions(prev => prev.map(x => (x.id === updated.id ? updated : x)));
    return updated;
  };

  const deleteInteraction = async (id: number) => {
    await dataService.deleteInteraction(id);
    setInteractions(prev => prev.filter(x => x.id !== id));
  };

  const can = (action: Action, target: Ownable) => canPerform(currentUser, action, target);
  const OwnershipGuard: DataContextValue['OwnershipGuard'] = ({ action, target, fallback = null, children }) => {
    return can(action, target) ? <>{children}</> : <>{fallback}</>;
  };

  const value: DataContextValue = useMemo(() => ({
    currentUser, setCurrentUser,
    users, topics, sessions, interactions,
    loading, error,
    reload,
    createUser, updateUser, deleteUser,
    createTopic, updateTopic, deleteTopic,
    createSession, updateSession, deleteSession,
    createInteraction, updateInteraction, deleteInteraction,
    can, OwnershipGuard,
    source, setSource,
  }), [currentUser, users, topics, sessions, interactions, loading, error, source]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};
