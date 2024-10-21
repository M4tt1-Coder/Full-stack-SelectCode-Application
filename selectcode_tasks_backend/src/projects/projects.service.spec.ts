import { Test } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { Repository } from 'typeorm';
import { Project, ProjectDTO } from './project.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

// I could not figure out how to mock the repository of the project entity.
// Using a mock factory I could implement some unit tests.
// Source: https://stackoverflow.com/questions/55366037/inject-typeorm-repository-into-nestjs-service-for-mock-data-testing

//! All other entities would have the same unit test cases.
//! So there is no need to implement own test files for them.

/**
 *  Ensure some typesafety when mocking
 */
type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: jest.Mock<{}>;
};

/**
 * Factory function
 *
 * Mock all function of the project repository that are needed
 */
const projectRepoMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  find: jest.fn((projects) => projects),
  findOne: jest.fn((project) => project),
  create: jest.fn((project) => project),
  save: jest.fn((project) => project),
  update: jest.fn((project) => project),
  delete: jest.fn((project) => project),
}));

// test the project service provider with mocking
describe('project database handling functions', () => {
  // mocking provider / instances
  let projectService: ProjectsService;
  let mockProjectRepository: MockType<Repository<Project>>;

  // mock variables
  const mockProjectEntities: Project[] = [
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
  const mockProjectDTOs: ProjectDTO[] = [
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

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useFactory: projectRepoMockFactory,
        },
      ],
    }).compile();

    projectService = moduleRef.get<ProjectsService>(ProjectsService);
    mockProjectRepository = moduleRef.get(getRepositoryToken(Project));
  });

  describe('findAll -> project in the database', () => {
    it('should return empty list of projects', async () => {
      mockProjectRepository.find.mockReturnValue([]);
      expect(await projectService.findAll()).toEqual([]);
    });

    it('should return all projects in the database in finished state', async () => {
      // mockProjectRepository.find.mockReturnValue(mockProjectEntities);
      mockProjectRepository.find.mockImplementation(() => {
        return mockProjectEntities.filter((project) => {
          if (project.status === 'Finished') {
            console.log(`Found: ${project.id}`);
            return project;
          }
        });
      });
      expect(await projectService.findAll()).toStrictEqual([
        mockProjectDTOs[0],
      ]);
    });
  });

  describe('findOne -> one specific project', () => {
    it('should return project of the specified id', async () => {
      mockProjectRepository.findOne.mockImplementation(() => {
        let output: Project;
        mockProjectEntities.forEach((project) => {
          if (project.id === '67536361-fef6-433e-b2b9-ef7f728833e1')
            output = project;
        });
        return output;
      });
      expect(
        await projectService.findOne('67536361-fef6-433e-b2b9-ef7f728833e1'),
      ).toEqual(mockProjectDTOs[0]);
    });
  });

  describe('create -> add project to list & return it', () => {
    it('should return created project', async () => {
      mockProjectRepository.findOne.mockReturnValue(mockProjectEntities[0]);
      expect(await projectService.create(mockProjectEntities[0])).toEqual(
        mockProjectDTOs[0],
      );
    });
  });

  describe('update -> returns updated project', () => {
    it('should return updated project', async () => {
      mockProjectRepository.findOne.mockReturnValue(mockProjectEntities[0]);
      expect(
        await projectService.update(mockProjectEntities[0].id, {
          name: 'Moinmoin',
        }),
      ).toEqual(mockProjectDTOs[0]);
    });
  });

  describe('delete -> remove project from list of projects', () => {
    it('should return deleted project', async () => {
      mockProjectRepository.findOne.mockReturnValue(mockProjectEntities[0]);
      expect(await projectService.delete(mockProjectEntities[0].id)).toEqual(
        mockProjectDTOs[0],
      );
    });
  });
});
