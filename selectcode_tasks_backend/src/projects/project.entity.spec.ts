// test all project helper functions

import { Project, ProjectDTO } from './project.entity';
import {
  projectList_ConvertDTOtoEntity,
  projectList_ConvertEntityToDTO,
} from './project.entity';

describe('test project helper functions', () => {
  // mock variables
  const projectDTOs: ProjectDTO[] = [
    {
      name: 'Implement testing',
      description: 'Create testing environment',
      id: '67536361-fef6-433e-b2b9-ef7f728833e1',
      status: 'Finished',
      creator: {
        name: 'John',
        id: '377f7d3c-5b72-4552-bad1-64cd3c88eb74',
        email: 'youarehere@gmail.com',
        password: '12345',
        role: 'Intern',
        lto: new Date(),
        projects: [],
      },
      tasks: [],
    },
    {
      name: 'Examine the challenge',
      description: 'Need some information how good the applicant is',
      id: 'f9502395-0726-4708-8022-23a6fd43150c',
      status: 'Development',
      creator: {
        name: 'John',
        id: '377f7d3c-5b72-4552-bad1-64cd3c88eb74',
        email: 'youarehere@gmail.com',
        password: '12345',
        role: 'Intern',
        lto: new Date(),
        projects: [],
      },
      tasks: [],
    },
  ];
  const projectEntities: Project[] = [
    {
      name: 'Implement testing',
      Description: 'Create testing environment',
      id: '67536361-fef6-433e-b2b9-ef7f728833e1',
      status: 'Finished',
      creator: {
        name: 'John',
        id: '377f7d3c-5b72-4552-bad1-64cd3c88eb74',
        email: 'youarehere@gmail.com',
        password: '12345',
        role: 'Intern',
        lastTimeOnline: new Date(),
        projects: [],
      },
      tasks: [],
    },
    {
      name: 'Examine the challenge',
      Description: 'Need some information how good the applicant is',
      id: 'f9502395-0726-4708-8022-23a6fd43150c',
      status: 'Development',
      creator: {
        name: 'John',
        id: '377f7d3c-5b72-4552-bad1-64cd3c88eb74',
        email: 'youarehere@gmail.com',
        password: '12345',
        role: 'Intern',
        lastTimeOnline: new Date(),
        projects: [],
      },
      tasks: [],
    },
  ];
  // DTOs -> entities
  it('should convert data transfer objects into task entities', () => {
    expect(projectList_ConvertDTOtoEntity(projectDTOs)).toStrictEqual(
      projectEntities,
    );
  });
  // entities -> DTOs
  it('should turn entities into dtos', () => {
    expect(projectList_ConvertEntityToDTO(projectEntities)).toStrictEqual(
      projectDTOs,
    );
  });
  // empty (entities) -> empty (DTOs)
  it('should return empty list of DTOs', () => {
    expect(projectList_ConvertEntityToDTO([])).toEqual([]);
  });
  //   empty (DTOs) -> empty (entities)
  it('shoud return empty list of entities', () => {
    expect(projectList_ConvertDTOtoEntity([])).toEqual<Project[]>([]);
  });
});
