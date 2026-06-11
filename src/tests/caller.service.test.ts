type CallerRecord = {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleId: number;
  isActive: boolean;
  createdAt: Date;
};

const prisma = {
  caller: {
    findUnique: jest.fn(),
  },
};

async function getCallerById(callerId: number): Promise<CallerRecord> {
  const record = await prisma.caller.findUnique({ where: { id: callerId } });
  if (!record) {
    throw new Error('Caller not found');
  }
  return record;
}

describe('callerService.getCallerById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the caller when the database record exists', async () => {
    const caller = {
      id: 7,
      name: 'Alex',
      email: 'alex@example.com',
      phone: '1234567890',
      roleId: 2,
      isActive: true,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    };

    (prisma.caller.findUnique as jest.Mock).mockResolvedValue(caller);

    await expect(getCallerById(7)).resolves.toEqual(caller);
  });

  it('throws Caller not found when findUnique returns null', async () => {
    (prisma.caller.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(getCallerById(99)).rejects.toThrow('Caller not found');
  });

  it('calls prisma.caller.findUnique with the expected argument', async () => {
    const caller = {
      id: 4,
      name: 'Sam',
      email: 'sam@example.com',
      phone: '0987654321',
      roleId: 1,
      isActive: true,
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
    };

    (prisma.caller.findUnique as jest.Mock).mockResolvedValue(caller);

    await getCallerById(4);

    expect(prisma.caller.findUnique).toHaveBeenCalledWith({ where: { id: 4 } });
  });

  it('propagates database errors from findUnique', async () => {
    (prisma.caller.findUnique as jest.Mock).mockRejectedValue(new Error('DB connection lost'));

    await expect(getCallerById(5)).rejects.toThrow('DB connection lost');
  });
});
