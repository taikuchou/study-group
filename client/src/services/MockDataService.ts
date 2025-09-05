import type { DataService } from './DataService';
import type { User, Topic, Interaction } from '../types';
import { mockUsers, mockTopics, mockInteractions } from '../data/mockData';

export class MockDataService implements DataService {
  private users: User[] = [...mockUsers];
  private topics: Topic[] = [...mockTopics];
  private interactions: Interaction[] = [...mockInteractions];

  async listUsers(): Promise<User[]> { return [...this.users]; }

  async createUser(user: User): Promise<User> {
    const newUser = { ...user, id: Math.max(0, ...this.users.map(u => u.id)) + 1 };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(user: User): Promise<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }

  async listTopics(): Promise<Topic[]> { return [...this.topics]; }

  async getTopic(id: number): Promise<Topic | undefined> {
    return this.topics.find(t => t.id === id);
  }

  async createTopic(topic: Topic): Promise<Topic> {
    this.topics.push(topic);
    return topic;
  }

  async updateTopic(topic: Topic): Promise<Topic> {
    this.topics = this.topics.map(t => t.id === topic.id ? topic : t);
    return topic;
  }

  async deleteTopic(id: number): Promise<void> {
    this.topics = this.topics.filter(t => t.id !== id);
  }

  async listInteractions(): Promise<Interaction[]> { return [...this.interactions]; }

  async createInteraction(i: Interaction): Promise<Interaction> {
    this.interactions.push(i);
    return i;
  }

  async updateInteraction(i: Interaction): Promise<Interaction> {
    const index = this.interactions.findIndex(interaction => interaction.id === i.id);
    if (index !== -1) {
      this.interactions[index] = i;
    }
    return i;
  }

  async deleteInteraction(id: number): Promise<void> {
    this.interactions = this.interactions.filter(i => i.id !== id);
  }
}
