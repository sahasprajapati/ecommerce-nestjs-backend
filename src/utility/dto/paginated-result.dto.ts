export class PaginatedResultDto<T> {
  data: T;
  page: number;
  limit: number;
  totalCount: number;
}
