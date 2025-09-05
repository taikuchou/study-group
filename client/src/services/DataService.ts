// ============== Service Interfaces ==============
import type { User, Topic, Interaction } from '../types';

export interface DataService {
  // Users
  listUsers(): Promise<User[]>;
  createUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: number): Promise<void>;

  // Topics
  listTopics(): Promise<Topic[]>;
  getTopic(id: number): Promise<Topic | undefined>;
  createTopic(topic: Topic): Promise<Topic>;
  updateTopic(topic: Topic): Promise<Topic>;
  deleteTopic(id: number): Promise<void>;

  // Interactions
  listInteractions(): Promise<Interaction[]>;
  createInteraction(i: Interaction): Promise<Interaction>;
  updateInteraction(i: Interaction): Promise<Interaction>;
  deleteInteraction(id: number): Promise<void>;
}

export type ServiceFactory = () => DataService;
