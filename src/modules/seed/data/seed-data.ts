export interface SeedUser {
    email: string;
    fullName: string;
    roles: string[];
  }
  
  export interface SeedRole {
    name: string;
  }
  
  export interface SeedData {
    roles: SeedRole[];
    users: SeedUser[];
  }
  
  export const initialSeedData: SeedData = {
    roles: [{ name: 'admin' }, { name: 'user' }, { name: 'super-user' }],
    users: [
      {
        email: 'admin@example.com',
        fullName: 'Admin User',
        roles: ['admin', 'user'],
      },
      {
        email: 'user@example.com',
        fullName: 'Normal User',
        roles: ['user'],
      },
      {
        email: 'super@example.com',
        fullName: 'Super User',
        roles: ['super-user', 'admin'],
      },
      {
        email: 'guest@example.com',
        fullName: 'Guest Example',
        roles: [],
      },
      {
        email: 'maria.lopez@gmail.com',
        fullName: 'Maria Lopez',
        roles: ['user'],
      },
      {
        email: 'jose.martinez@gmail.com',
        fullName: 'Jose Martinez',
        roles: ['admin'],
      },
      {
        email: 'laura.fernandez@gmail.com',
        fullName: 'Laura Fernandez',
        roles: ['user', 'super-user'],
      },
      {
        email: 'kevin.hernandez@example.com',
        fullName: 'Kevin Hernandez',
        roles: ['user'],
      },
      {
        email: 'sophia.castillo@example.com',
        fullName: 'Sophia Castillo',
        roles: ['admin', 'user'],
      },
      {
        email: 'bruno.gomez@example.com',
        fullName: 'Bruno Gomez',
        roles: [],
      },
    ],
  };
  