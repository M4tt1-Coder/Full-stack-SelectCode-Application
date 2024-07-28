// union type for a status that a project or task can be in
export type Status = 'Preparing' | 'Development' | 'Finished';

export function defaultStatus(): Status {
  return 'Preparing';
}
