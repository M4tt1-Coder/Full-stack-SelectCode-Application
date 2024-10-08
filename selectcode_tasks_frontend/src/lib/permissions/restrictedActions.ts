// Determine if a user of a specific role can update user information

import type { User } from '$lib/types/user';

/**
 *	Mainly to make sure that normal admins can't delete another admin, himself or
 * 	a super admin.
 *
 * @param loggedInUserRole - Role of the user that is logged in
 * @param toBeMutatedUserRole - Role of the user that is to be deleted
 * @returns True if the user can delete another user
 */
export function canUserDeleteUser(
	loggedInUserRole: 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin',
	toBeMutatedUserRole: 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin'
): boolean {
	// super admin can do everything
	if (loggedInUserRole === 'SuperAdmin') {
		return true;
	}

	// when logged in user is a admin
	if (loggedInUserRole === 'Admin') {
		if (toBeMutatedUserRole === 'SuperAdmin' || toBeMutatedUserRole === 'Admin') {
			return false;
		} else {
			return true;
		}
	}

	return false;
}

/**
 *	A simple utility function for checking if a user is a intern or expert.
 *
 * @param userRole - Role of the user
 * @returns True if the user is a intern or expert
 */
export function isUserAnInternOrExpert(
	userRole: 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin'
): boolean {
	if (userRole === 'Intern' || userRole === 'Expert') {
		return true;
	}
	return false;
}

/**
 * Is only called in the user page.
 *
 * Determines whether a user is allowed to update some information.
 *
 * @param role - role the logged in user has
 * @param toBeMutatedUserID - ID of the user to be updated
 * @param loggedInUserID - ID of the of current logged in user
 * @returns - if the user is allowed to update
 */
export function canUserUpdateInfo(
	role: 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin',
	toBeMutatedUserID: string,
	toBeMutatedUserRole: 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin',
	loggedInUserID: string
): boolean {
	// when user is superadmin -> already true
	if (role === 'SuperAdmin') {
		return true;
	}
	// when an admin wants to update a superadmin
	if (role === 'Admin') {
		if (toBeMutatedUserRole === 'SuperAdmin') {
			return false;
		} else {
			return true;
		}
	}

	// if the user mutates his account -> return true
	if (toBeMutatedUserID === loggedInUserID) {
		return true;
	}

	if (role === 'Expert' || role === 'Intern') {
		return false;
	}

	return false;
}

/**
 * It fulfills the same function as the other permission method.
 *
 * Based on the role of the user, he / she can mutate the task properties.
 *
 * He needs to be administrator or an assignee of the task.
 *
 * @param role - The role of the user
 * @param userId - The id of the user
 * @param assignees - The list of assignees of the task
 *
 * @returns true if the user can mutate the task properties
 */
export function canUserModifyTaskStatus(
	role: 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin',
	userId: string,
	assignees: User[]
): boolean {
	// admin?
	if (role === 'Admin' || role === 'SuperAdmin') {
		return true;
	}

	let doesUserIsAssignee: boolean = false;

	// intern / expert but assignee
	assignees.forEach((assignee) => {
		if (assignee.id === userId) {
			doesUserIsAssignee = true;
		}
	});

	if (doesUserIsAssignee) {
		return true;
	}

	// normal intern / expert
	if (role === 'Intern' || role === 'Expert') {
		return false;
	}

	// default return
	return false;
}
