/**
 * Calculates pagination metadata.
 * @param total - Total number of records in DB
 * @param page - Current page number (1-based)
 * @param limit - Records per page
 * @returns - Object with totalPages, hasNextPage, hasPrevPage, currentPage, limit
 */
export function getPaginationMeta(total: number, page: number, limit: number) {
  const safeLimit = Math.max(limit, 1);
  const totalPages = total > 0 ? Math.ceil(total / safeLimit) : 0;

  return {
    total,
    totalPages,
    currentPage: page,
    limit: safeLimit,
    hasNextPage: totalPages > 0 && page < totalPages,
    hasPrevPage: page > 1,
  };
}
