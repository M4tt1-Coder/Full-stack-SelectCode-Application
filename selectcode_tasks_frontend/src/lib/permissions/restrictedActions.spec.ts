import { describe, it, expect } from 'vitest';
import { canUserModifyTaskStatus, canUserUpdateInfo } from './restrictedActions';

// Testing the permission helper functions
// Essential for right appearance and rights

const userOneID: string = '0a5594e4-6ed5-46be-aeee-f6bc1f7e0950';
const userTwoID: string = 'a4de997b-4b1a-4625-bee4-aaf056b1d6a0';

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
	it('', () => {});
});
