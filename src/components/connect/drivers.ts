import type { DriverId } from '@shared/api';

export interface DriverDescriptor {
  id: DriverId;
  label: string;
  scheme: string;
  defaultPort: number;
  available: boolean;
  placeholder: string;
}

export const DRIVERS: DriverDescriptor[] = [
  {
    id: 'postgres',
    label: 'Postgres',
    scheme: 'postgres',
    defaultPort: 5432,
    available: true,
    placeholder: 'postgres://user:password@localhost:5432/mydb',
  },
  {
    id: 'mysql',
    label: 'MySQL',
    scheme: 'mysql',
    defaultPort: 3306,
    available: true,
    placeholder: 'mysql://user:password@localhost:3306/mydb',
  },
  {
    id: 'sqlite',
    label: 'SQLite',
    scheme: 'sqlite',
    defaultPort: 0,
    available: false,
    placeholder: 'sqlite:///path/to/db.sqlite',
  },
  {
    id: 'mongodb',
    label: 'MongoDB',
    scheme: 'mongodb',
    defaultPort: 27017,
    available: false,
    placeholder: 'mongodb://user:password@localhost:27017/mydb',
  },
];

const DEFAULT_DRIVER = DRIVERS[0] as DriverDescriptor;

export function driverById(id: DriverId): DriverDescriptor {
  return DRIVERS.find((d) => d.id === id) ?? DEFAULT_DRIVER;
}
