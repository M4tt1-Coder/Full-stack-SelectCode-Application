import { describe, it, expect } from 'vitest';
import { canUserModifyTaskStatus, canUserUpdateInfo } from './restrictedActions';
import type { User } from '$lib/types/user';

// Testing the permission helper functions
// Essential for right appearance and rights

const userOneID: string = '0a5594e4-6ed5-46be-aeee-f6bc1f7e0950';
const userTwoID: string = 'a4de997b-4b1a-4625-bee4-aaf056b1d6a0';
const assignedUsers: User[] = [
	{
		name: 'Paula',
		id: userOneID,
		password: 'somePassword',
		email: 'paula@test.com',
		role: 'Expert',
		lto: new Date(),
		projects: []
	}
];

// all use cases for the `canUserUpdateInfo`
describe('Make sure that the right results for users with different roles come out', () => {
	// test for updating a user properties
	it('Admin should immediately return true', () => {
		expect(canUserUpdateInfo('Admin', '', '')).toBe(true);
	});

	// user is intern / expert but isnt the user to be updated
	it('User is an Intern and is not the user that he wants to modify -> should be false', () => {
		expect(canUserUpdateInfo('Intern', userOneID, userTwoID)).toBe(false);
	});

	// user is intern / expert and the same user he / she wants to modify
	it('User is an intern but updates his own date -> true', () => {
		expect(canUserUpdateInfo('Intern', userOneID, userOneID)).toBe(true);
	});
});

// when the user is about to change a task he / she was assigned to
describe('different situations when the user modifies a task', () => {
	// when the user is a admin
	it('user is an admin when modifying a task', () => {
		expect(canUserModifyTaskStatus('SuperAdmin', userOneID, [])).toBe(true);
	});

	// user is an intern / expert + not an assignee
	it('user tries to edit a task but is not an assignee', () => {
		expect(canUserModifyTaskStatus('Expert', userTwoID, assignedUsers)).toBe(false);
	});

	// intern BUT an assignee
	it('intern assignee to the task tries to modify task', () => {
		expect(canUserModifyTaskStatus('Expert', userOneID, assignedUsers)).toBe(true);
	});
});
