/**
 * union type for a status that a project or task can be in
 */
export type Status = 'Preparing' | 'Development' | 'Finished';

/**
 * The default status for a project or task is 'Preparing'.
 *
 * It is used for creating instances of tasks & projects.
 *
 * @returns Preparing status
 */
export function defaultStatus(): Status {
  return 'Preparing';
}
