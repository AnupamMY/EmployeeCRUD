import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateEmployee } from '../src/validation/employee';
import Employee from '../src/models/employeeModel';

const valid = { name: 'Ann Lee', email: 'ann@example.com', role: 'Developer' };

test('trims fields and normalizes email', () => {
  assert.deepEqual(validateEmployee({ name: ' Ann Lee ', email: ' ANN@EXAMPLE.COM ', role: ' Developer ' }).input, valid);
});

test('allows names over 32 characters up to 100', () => {
  assert.ok(validateEmployee({ ...valid, name: 'a'.repeat(33) }).input);
  assert.ok(validateEmployee({ ...valid, name: 'a'.repeat(100) }).input);
  assert.ok(validateEmployee({ ...valid, name: 'a'.repeat(101) }).error);
});

test('job role boundary is 32 characters', () => {
  assert.ok(validateEmployee({ ...valid, role: 'a'.repeat(32) }).input);
  assert.ok(validateEmployee({ ...valid, role: 'a'.repeat(33) }).error);
});

test('rejects malformed emails and missing or non-string fields', () => {
  for (const email of ['ann', 'ann@', '@example.com', 'ann@@example.com', 'ann lee@example.com', 'ann@example']) {
    assert.ok(validateEmployee({ ...valid, email }).error, email);
  }
  for (const body of [null, [], {}, { ...valid, name: '  ' }, { ...valid, role: 32 }, { ...valid, email: null }]) {
    assert.ok(validateEmployee(body).error);
  }
});

test('database schema also rejects invalid email and long roles', async () => {
  await new Employee({ ...valid, name: 'a'.repeat(33) }).validate();
  await assert.rejects(new Employee({ ...valid, email: 'invalid' }).validate(), /email/);
  await assert.rejects(new Employee({ ...valid, role: 'a'.repeat(33) }).validate(), /role/);
});
