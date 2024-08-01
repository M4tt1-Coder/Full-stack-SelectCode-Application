export type Role = 'Intern' | 'Expert' | 'Admin' | 'SuperAdmin';

/**
 *
 * Simple utility function for getting the default role
 *
 * @returns The 'Intern' role as standard
 */
export function defaultRole(): Role {
  return 'Intern';
}

/**
 *  Test string if it is a valid role.
 *
 * @param role string to be tested
 * @returns true if it is a valid role
 */
export function isMember(role: string): boolean {
  if (
    role !== 'Intern' &&
    role !== 'Expert' &&
    role !== 'Admin' &&
    role !== 'SuperAdmin'
  ) {
    return false;
  }
  return true;
}

/**
 *
 * Takes a string and returns its corresponding role.
 *
 * @param role - string to be converted to Role type
 */
export function stringToRole(role: string): Role {
  if (role === 'Intern') {
    return 'Intern';
  }
  if (role === 'Expert') {
    return 'Expert';
  }
  if (role === 'Admin') {
    return 'Admin';
  }
  if (role === 'SuperAdmin') {
    return 'SuperAdmin';
  }
}
