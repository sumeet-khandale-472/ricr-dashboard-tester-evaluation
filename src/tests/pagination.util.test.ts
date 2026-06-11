import { getPaginationMeta } from '../utils/pagination.util';

describe('getPaginationMeta', () => {
  it('returns correct metadata for standard pagination', () => {
    expect(getPaginationMeta(100, 1, 10)).toEqual({
      total: 100,
      totalPages: 10,
      currentPage: 1,
      limit: 10,
      hasNextPage: true,
      hasPrevPage: false,
    });
  });

  it('marks the last page correctly', () => {
    expect(getPaginationMeta(100, 10, 10)).toEqual(
      expect.objectContaining({
        totalPages: 10,
        hasNextPage: false,
        hasPrevPage: true,
      })
    );
  });

  it('marks middle pages with both navigation flags enabled', () => {
    expect(getPaginationMeta(50, 3, 5)).toEqual(
      expect.objectContaining({
        totalPages: 10,
        hasNextPage: true,
        hasPrevPage: true,
      })
    );
  });

  it('handles a partial final page', () => {
    expect(getPaginationMeta(23, 3, 10)).toEqual(
      expect.objectContaining({
        totalPages: 3,
        hasNextPage: false,
      })
    );
  });

  it('returns one page for a small dataset', () => {
    expect(getPaginationMeta(5, 1, 10)).toEqual(
      expect.objectContaining({
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      })
    );
  });

  it('returns zero pages when there are no records', () => {
    expect(getPaginationMeta(0, 1, 10)).toEqual({
      total: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: false,
    });
  });
});
