import {
  Task,
  TaskDTO,
  taskList_ConvertDTOtoEntity,
  taskList_ConvertEntityToDTO,
} from './task.entity';

// test all utility functions related to the task entity

describe('cover all data convertion cases for task entities and DTOs', () => {
  //   mock variables
  const taskDTOs: TaskDTO[] = [
    {
      name: 'Delete the test',
      description: 'Remove the test from the database',
      status: 'Development',
      assignees: [],
      project: {
        id: '9fbfbe52-0e9b-4937-b270-13d3ab193b16',
        name: 'Test executions',
        description: 'Manage all task with TDD',
        status: 'Development',
        creator: {
          id: '39b37d4f-a835-478a-93f2-f542a7e9544e',
          name: 'Paul',
          password: '12345',
          email: 'paul@example.com',
          role: 'Admin',
          lto: new Date(),
          projects: [],
        },
        tasks: [],
      },
      id: 'b03d2022-5046-4118-bdfb-3b7479407eda',
    },
    {
      name: 'Run the test',
      description: 'Go to the test directory and run the tests',
      status: 'Preparing',
      assignees: [],
      project: {
        id: 'e9bd2ff7-5a25-4e19-abb6-b5e11e666072',
        name: 'Test executions',
        description: 'Manage all task with TDD',
        status: 'Development',
        creator: {
          id: '39b37d4f-a835-478a-93f2-f542a7e9544e',
          name: 'Paul',
          password: '12345',
          email: 'paul@example.com',
          role: 'Admin',
          lto: new Date(),
          projects: [],
        },
        tasks: [],
      },
      id: '0ad465ee-5acc-4d19-a804-cfef2fbf2b9a',
    },
  ];
  const taskEntities: Task[] = [
    {
      name: 'Delete the test',
      description: 'Remove the test from the database',
      status: 'Development',
      assignees: [],
      project: {
        id: '9fbfbe52-0e9b-4937-b270-13d3ab193b16',
        name: 'Test executions',
        Description: 'Manage all task with TDD',
        status: 'Development',
        creator: {
          id: '39b37d4f-a835-478a-93f2-f542a7e9544e',
          name: 'Paul',
          password: '12345',
          email: 'paul@example.com',
          role: 'Admin',
          lastTimeOnline: new Date(),
          projects: [],
        },
        tasks: [],
      },
      id: 'b03d2022-5046-4118-bdfb-3b7479407eda',
    },
    {
      name: 'Run the test',
      description: 'Go to the test directory and run the tests',
      status: 'Preparing',
      assignees: [],
      project: {
        id: 'e9bd2ff7-5a25-4e19-abb6-b5e11e666072',
        name: 'Test executions',
        Description: 'Manage all task with TDD',
        status: 'Development',
        creator: {
          id: '39b37d4f-a835-478a-93f2-f542a7e9544e',
          name: 'Paul',
          password: '12345',
          email: 'paul@example.com',
          role: 'Admin',
          lastTimeOnline: new Date(),
          projects: [],
        },
        tasks: [],
      },
      id: '0ad465ee-5acc-4d19-a804-cfef2fbf2b9a',
    },
  ];
  // DTOs -> entities
  it('should convert data transfer objects into task entities', () => {
    expect(taskList_ConvertDTOtoEntity(taskDTOs)).toStrictEqual(taskEntities);
  });
  // entities -> DTOs
  it('should turn entities into dtos', () => {
    expect(taskList_ConvertEntityToDTO(taskEntities)).toStrictEqual(taskDTOs);
  });
  // empty (entities) -> empty (DTOs)
  it('should return empty list of DTOs', () => {
    expect(taskList_ConvertEntityToDTO([])).toEqual([]);
  });
  //   empty (DTOs) -> empty (entities)
  it('shoud return empty list of entities', () => {
    expect(taskList_ConvertDTOtoEntity([])).toEqual<Task[]>([]);
  });
});
