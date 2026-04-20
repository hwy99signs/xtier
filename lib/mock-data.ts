/**
 * Mock data for development preview.
 * Replace with Supabase queries when the backend is connected.
 */

// ── Credentials ──────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  {
    email: 'subscriber@example.com',
    password: 'Subscriber123!',
    role: 'CUSTOMER',
    name: 'John Subscriber',
    firstName: 'John',
  },
  {
    email: 'driver@example.com',
    password: 'Driver123!',
    role: 'DRIVER',
    name: 'Jane Driver',
    firstName: 'Jane',
  },
  {
    email: 'admin@erantt-transit.com',
    password: 'AdminPass123!',
    role: 'ADMIN',
    name: 'System Administrator',
    firstName: 'System',
  },
];

// ── Member (subscriber) mock record ──────────────────────────────────────────
export const MOCK_SUBSCRIBER = {
  id: 'mock-sub-001',
  status: 'APPROVED',
  paymentStatus: 'COMMITMENT_PAID',
  pickupAddress: '123 Kingwood Dr',
  pickupCity: 'Kingwood',
  pickupState: 'TX',
  pickupZip: '77339',
  dropoffAddress: 'IAH Terminal C',
  dropoffCity: 'Houston',
  dropoffState: 'TX',
  dropoffZip: '77032',
  direction: 'BOTH',
  distanceMiles: 22,
  estimatedPrice: 45,
  commitmentPaid: 9,
  balanceDue: 36,
  createdAt: '2026-03-01T00:00:00Z',
  approvedAt: '2026-03-05T00:00:00Z',
  zone: { name: 'Kingwood Central' },
  assignedDriver: {
    user: { firstName: 'Jane', lastName: 'Driver' },
    vehicleYear: 2022,
    vehicleMake: 'Lexus',
    vehicleModel: 'ES 350',
    vehiclePlate: 'ERT-1234',
    vehicleColor: 'Black',
  },
  bookings: [
    {
      id: 'b1',
      direction: 'TO_AIRPORT',
      scheduledAt: '2026-04-20T06:00:00Z',
      status: 'PENDING',
    },
    {
      id: 'b2',
      direction: 'FROM_AIRPORT',
      scheduledAt: '2026-04-10T18:00:00Z',
      status: 'COMPLETED',
    },
    {
      id: 'b3',
      direction: 'TO_AIRPORT',
      scheduledAt: '2026-03-28T05:30:00Z',
      status: 'COMPLETED',
    },
  ],
};

// ── Driver mock record ────────────────────────────────────────────────────────
export const MOCK_DRIVER = {
  id: 'mock-drv-001',
  status: 'ACTIVE',
  shiftStatus: 'ON_DUTY',
  isAvailable: true,
  licenseNumber: 'TX12345678',
  licenseState: 'TX',
  licenseExpiry: '2028-12-31T00:00:00Z',
  yearsExperience: 10,
  vehicleMake: 'Lexus',
  vehicleModel: 'ES 350',
  vehicleYear: 2022,
  vehicleColor: 'Black',
  vehiclePlate: 'ERT-1234',
  vehicleCapacity: 4,
  createdAt: '2026-02-01T00:00:00Z',
  approvedAt: '2026-02-10T00:00:00Z',
  subscribers: [
    {
      id: 'mock-sub-001',
      status: 'APPROVED',
      direction: 'BOTH',
      pickupZip: '77339',
      user: { firstName: 'John', lastName: 'Subscriber', phone: '(832) 555-0101' },
      zone: { name: 'Kingwood Central' },
    },
    {
      id: 'mock-sub-002',
      status: 'APPROVED',
      direction: 'TO_AIRPORT',
      pickupZip: '77345',
      user: { firstName: 'Sarah', lastName: 'Wilson', phone: '(832) 555-0102' },
      zone: { name: 'Kingwood North' },
    },
    {
      id: 'mock-sub-003',
      status: 'APPROVED',
      direction: 'BOTH',
      pickupZip: '77396',
      user: { firstName: 'Michael', lastName: 'Chen', phone: '(832) 555-0103' },
      zone: { name: 'Atascocita' },
    },
    {
      id: 'mock-sub-004',
      status: 'APPROVED',
      direction: 'FROM_AIRPORT',
      pickupZip: '77339',
      user: { firstName: 'Angela', lastName: 'Torres', phone: '(832) 555-0104' },
      zone: { name: 'Kingwood Central' },
    },
  ],
};

export const MOCK_TODAYS_BOOKINGS = [
  {
    id: 'b-today-1',
    riderName: 'John Subscriber',
    phone: '(832) 555-0101',
    direction: 'TO_AIRPORT',
    scheduledTime: '06:00 AM',
    pickupAddress: '123 Kingwood Dr, Kingwood, TX 77339',
    dropoffAddress: 'IAH - Terminal C',
    status: 'COMPLETED',
    type: 'PICKUP',
  },
  {
    id: 'b-today-2',
    riderName: 'Sarah Wilson',
    phone: '(832) 555-0102',
    direction: 'TO_AIRPORT',
    scheduledTime: '06:30 AM',
    pickupAddress: '456 Northpark Dr, Kingwood, TX 77345',
    dropoffAddress: 'IAH - Terminal B',
    status: 'COMPLETED',
    type: 'PICKUP',
  },
  {
    id: 'b-today-3',
    riderName: 'Michael Chen',
    phone: '(832) 555-0103',
    direction: 'TO_AIRPORT',
    scheduledTime: '08:15 AM',
    pickupAddress: '789 W Lake Houston Pkwy, Atascocita, TX 77396',
    dropoffAddress: 'IAH - Terminal A',
    status: 'EN_ROUTE',
    type: 'PICKUP',
  },
  {
    id: 'b-today-4',
    riderName: 'Angela Torres',
    phone: '(832) 555-0104',
    direction: 'FROM_AIRPORT',
    scheduledTime: '10:45 AM',
    pickupAddress: 'IAH - Ground Transportation (Zone 4)',
    dropoffAddress: '321 Woodland Hills Dr, Kingwood, TX 77339',
    status: 'PENDING',
    type: 'DROPOFF',
  },
];

export const MOCK_DRIVER_ALERTS = [
  {
    id: 'alert-1',
    type: 'URGENT',
    message: 'Road closure on Hwy 59 North. Expect 15-minute delays to IAH.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alert-2',
    type: 'INFO',
    message: 'New uniform standard issued for Q3. Please review in settings.',
    createdAt: new Date().toISOString(),
  },
];

// ── Admin Lists (Mocking Prisma response structures) ─────────────────────────
export const MOCK_SUBSCRIBERS_LIST = [
  {
    ...MOCK_SUBSCRIBER,
    user: { firstName: 'John', lastName: 'Subscriber', email: 'subscriber@example.com' },
  },
  {
    id: 'mock-sub-002',
    status: 'PENDING_APPROVAL',
    direction: 'TO_AIRPORT',
    pickupZip: '77345',
    estimatedPrice: 55,
    createdAt: '2026-04-10T09:00:00Z',
    user: { firstName: 'Sarah', lastName: 'Wilson', email: 'sarah.w@gmail.com' },
  },
  {
    id: 'mock-sub-003',
    status: 'WAITLISTED',
    direction: 'BOTH',
    pickupZip: '77339',
    estimatedPrice: 45,
    createdAt: '2026-04-05T14:20:00Z',
    user: { firstName: 'David', lastName: 'Miller', email: 'dmiller@outlook.com' },
  },
  {
    id: 'mock-sub-004',
    status: 'APPROVED',
    direction: 'BOTH',
    pickupZip: '77396',
    estimatedPrice: 65,
    createdAt: '2026-03-20T11:00:00Z',
    user: { firstName: 'Michael', lastName: 'Chen', email: 'mchen22@yahoo.com' },
  },
];

export const MOCK_DRIVERS_LIST = [
  {
    id: 'mock-drv-001',
    status: 'ACTIVE',
    licenseNumber: 'TX12345678',
    vehicleMake: 'Lexus',
    vehicleModel: 'ES 350',
    vehicleYear: 2022,
    vehiclePlate: 'ERT-1234',
    vehicleCapacity: 4,
    yearsExperience: 10,
    user: { firstName: 'Jane', lastName: 'Driver' },
  },
  {
    id: 'mock-drv-002',
    status: 'PENDING_REVIEW',
    licenseNumber: 'TX88776655',
    vehicleMake: 'Cadillac',
    vehicleModel: 'Escalade',
    vehicleYear: 2023,
    vehiclePlate: 'LUX-777',
    vehicleCapacity: 6,
    yearsExperience: 15,
    user: { firstName: 'Robert', lastName: 'Vance' },
  },
];

export const MOCK_AUDIT_LOGS = [
  { id: 'log-1', action: 'MEMBER_APPROVED', adminName: 'System', targetEntity: 'MEMBER', createdAt: '2026-04-13T10:00:00Z' },
  { id: 'log-2', action: 'PRICING_UPDATED', adminName: 'System', targetEntity: 'ZONE', createdAt: '2026-04-12T15:30:00Z' },
  { id: 'log-3', action: 'DRIVER_ONBOARDED', adminName: 'System', targetEntity: 'DRIVER', createdAt: '2026-04-11T09:15:00Z' },
  { id: 'log-4', action: 'ROUTE_MODIFIED', adminName: 'System', targetEntity: 'ROUTE', createdAt: '2026-04-10T14:45:00Z' },
  { id: 'log-5', action: 'WAITLIST_PROMOTED', adminName: 'System', targetEntity: 'MEMBER', createdAt: '2026-04-09T08:20:00Z' },
];

export type MockSession = {
  email: string;
  name: string;
  role: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
};
