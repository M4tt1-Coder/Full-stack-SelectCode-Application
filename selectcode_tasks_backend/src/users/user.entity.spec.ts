import {
  User,
  UserDTO,
  UserList_ConvertDTOtoEntity,
  UserList_ConvertEntityToDTO,
} from './user.entity';

// I encountered the problem that jest couldn't find important modules for testing.
// A solution was on stack overflow: https://stackoverflow.com/questions/63865678/nestjs-test-suite-failed-to-run-cannot-find-module-src-article-article-entity
// Adding a schema for jest how to handle module paths correctly.

// test the convertion functions of userDTOS to entity objects and visa versa
describe('Convert lists of different user datatypes', () => {
  // testing variables
  const userDTOS: UserDTO[] = [
    {
      name: 'John',
      id: '377f7d3c-5b72-4552-bad1-64cd3c88eb74',
      email: 'youarehere@gmail.com',
      password: '12345',
      role: 'Intern',
      lto: new Date(),
      projects: [],
    },
    {
      name: 'Lisa',
      id: '510ec0b9-e1b1-4dec-ba7a-1204bae2739d',
      email: 'whatsup@gmail.com',
      password: '54321',
      role: 'Admin',
      lto: new Date(),
      projects: [],
    },
  ];
  const userEntities: User[] = [
    {
      name: 'John',
      id: '377f7d3c-5b72-4552-bad1-64cd3c88eb74',
      email: 'youarehere@gmail.com',
      password: '12345',
      role: 'Intern',
      lastTimeOnline: new Date(),
      projects: [],
    },
    {
      name: 'Lisa',
      id: '510ec0b9-e1b1-4dec-ba7a-1204bae2739d',
      email: 'whatsup@gmail.com',
      password: '54321',
      role: 'Admin',
      lastTimeOnline: new Date(),
      projects: [],
    },
  ];
  // converting list of dtos to entity objects
  it('Making sure all data of DTOs is converted correctly', () => {
    expect(UserList_ConvertDTOtoEntity(userDTOS)).toStrictEqual(userEntities);
  });
  // entities to dto objects
  it('should convert user entities into DTOs', () => {
    expect(UserList_ConvertEntityToDTO(userEntities)).toStrictEqual(userDTOS);
  });
  // try to convert empty lists
  it('should return empty list of entities back and log info', () => {
    expect(UserList_ConvertDTOtoEntity([])).toStrictEqual([]);
  });
  it('should return empty list of dtos', () => {
    expect(UserList_ConvertEntityToDTO([])).toStrictEqual([]);
  });
});
