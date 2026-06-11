type ReqUser = {
  id: number;
  email: string;
  userType: number;
};

type InteractionBody = {
  studentId?: number | string;
  statusId?: number | string;
  remarks?: string;
};

const interactionService = {
  createInteraction: jest.fn(),
};

function createInteraction(req: { body: InteractionBody; user: ReqUser }, res: any) {
  const { studentId, statusId, remarks } = req.body;

  if (!studentId) {
    return res.status(400).json({ success: false, message: 'Student ID is required' });
  }

  if (!statusId) {
    return res.status(400).json({ success: false, message: 'Status ID is required' });
  }

  if (!remarks) {
    return res.status(400).json({ success: false, message: 'Remarks are required' });
  }

  return interactionService
    .createInteraction(req.body, req.user.id)
    .then((result: unknown) => {
      res.status(201).json({ success: true, message: 'Interaction logged', data: result });
    })
    .catch((error: Error) => {
      res.status(500).json(error.message);
    });
}

describe('createInteraction controller', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    interactionService.createInteraction.mockReset();
  });

  it('returns 400 when studentId is missing', async () => {
    const req = { body: { statusId: 1, remarks: 'ok' }, user: { id: 1, email: 'a@b.com', userType: 1 } };

    await createInteraction(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Student ID is required' });
  });

  it('returns 400 when statusId is missing', async () => {
    const req = { body: { studentId: 1, remarks: 'ok' }, user: { id: 1, email: 'a@b.com', userType: 1 } };

    await createInteraction(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Status ID is required' });
  });

  it('returns 400 when remarks are missing', async () => {
    const req = { body: { studentId: 1, statusId: 1 }, user: { id: 1, email: 'a@b.com', userType: 1 } };

    await createInteraction(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Remarks are required' });
  });

  it('returns 201 and the created record on success', async () => {
    const req = { body: { studentId: 1, statusId: 2, remarks: 'ok' }, user: { id: 1, email: 'a@b.com', userType: 1 } };
    const result = { id: 10, studentId: 1, statusId: 2, remarks: 'ok' };

    interactionService.createInteraction.mockResolvedValue(result);

    await createInteraction(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Interaction logged', data: result });
  });

  it('returns 500 when the service throws', async () => {
    const req = { body: { studentId: 1, statusId: 2, remarks: 'ok' }, user: { id: 1, email: 'a@b.com', userType: 1 } };

    interactionService.createInteraction.mockRejectedValue(new Error('boom'));

    await createInteraction(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith('boom');
  });

  it('passes the request body and user id to the service on valid input', async () => {
    const req = { body: { studentId: 1, statusId: 2, remarks: 'ok' }, user: { id: 1, email: 'a@b.com', userType: 1 } };
    const result = { id: 10 };

    interactionService.createInteraction.mockResolvedValue(result);

    await createInteraction(req as any, res as any);

    expect(interactionService.createInteraction).toHaveBeenCalledWith(req.body, 1);
  });
});
