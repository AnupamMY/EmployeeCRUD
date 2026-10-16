export const NAME_MAX_LENGTH = 100;
export const ROLE_MAX_LENGTH = 32;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EmployeeInput {
  name: string;
  email: string;
  role: string;
}

type ValidationResult = { input: EmployeeInput; error?: never } | { input?: never; error: string };

export function validateEmployee(body: unknown): ValidationResult {
  if (!body || typeof body !== 'object') {
    return { error: 'Enter a full name, email address, and job role.' };
  }

  const { name, email, role } = body as Record<string, unknown>;
  if (typeof name !== 'string' || !name.trim()) return { error: 'Full name is required.' };
  if (typeof email !== 'string' || !email.trim()) return { error: 'Email address is required.' };
  if (typeof role !== 'string' || !role.trim()) return { error: 'Job role is required.' };

  const input = { name: name.trim(), email: email.trim().toLowerCase(), role: role.trim() };
  if (input.name.length > NAME_MAX_LENGTH) return { error: 'Full name must be 100 characters or fewer.' };
  if (input.email.length > 254 || !EMAIL_PATTERN.test(input.email)) return { error: 'Enter a valid email address, such as name@company.com.' };
  if (input.role.length > ROLE_MAX_LENGTH) return { error: 'Job role must be 32 characters or fewer.' };
  return { input };
}
