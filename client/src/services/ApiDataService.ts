import type { DataService } from "./DataService";
import type { User, Topic, Interaction } from "../types";

/** Minimal fetch wrapper; replace BASE_URL to match your backend. */
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export class ApiDataService implements DataService {
  async listUsers(): Promise<User[]> {
    const res = await fetch(`${BASE_URL}/users`, { credentials: "include" });
    return json<User[]>(res);
  }

  async createUser(user: User): Promise<User> {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
      credentials: "include",
    });
    return json<User>(res);
  }

  async updateUser(user: User): Promise<User> {
    const res = await fetch(`${BASE_URL}/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
      credentials: "include",
    });
    return json<User>(res);
  }

  async deleteUser(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${body}`);
    }
  }
  async listTopics(): Promise<Topic[]> {
    const res = await fetch(`${BASE_URL}/topics`, { credentials: "include" });
    return json<Topic[]>(res);
  }
  async getTopic(id: number): Promise<Topic | undefined> {
    const res = await fetch(`${BASE_URL}/topics/${id}`, {
      credentials: "include",
    });
    return json<Topic>(res);
  }
  async createTopic(topic: Topic): Promise<Topic> {
    const res = await fetch(`${BASE_URL}/topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(topic),
      credentials: "include",
    });
    return json<Topic>(res);
  }
  async updateTopic(topic: Topic): Promise<Topic> {
    const res = await fetch(`${BASE_URL}/topics/${topic.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(topic),
      credentials: "include",
    });
    return json<Topic>(res);
  }
  async deleteTopic(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/topics/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${body}`);
    }
  }

  async listInteractions(): Promise<Interaction[]> {
    const res = await fetch(`${BASE_URL}/interactions`, {
      credentials: "include",
    });
    return json<Interaction[]>(res);
  }

  async createInteraction(i: Interaction): Promise<Interaction> {
    const res = await fetch(`${BASE_URL}/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(i),
      credentials: "include",
    });
    return json<Interaction>(res);
  }

  async updateInteraction(i: Interaction): Promise<Interaction> {
    const res = await fetch(`${BASE_URL}/interactions/${i.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(i),
      credentials: "include",
    });
    return json<Interaction>(res);
  }

  async deleteInteraction(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/interactions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${body}`);
    }
  }
}
