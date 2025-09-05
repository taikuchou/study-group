// ============== Ownership helpers ==============
import type { User } from '../types';

export type Action = 'read' | 'create' | 'edit' | 'delete';

export type Ownable = { createdBy?: number; authorId?: number } & Record<string, unknown>;

/** Admins can do everything; owners can edit/delete their own stuff. */
export function canPerform(user: User | null | undefined, action: Action, resource?: Ownable): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (!resource) return action === 'read' || action === 'create';
  const ownerId = resource.createdBy ?? resource.authorId;
  if (ownerId == null) return action === 'read' || action === 'create';
  return ownerId === user.id || action === 'read' || action === 'create';
}
