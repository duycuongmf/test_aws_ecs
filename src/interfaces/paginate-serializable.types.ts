import { PaginatedResult } from './paginated-result.interface';

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};

export type PaginateSerializable = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions
) => Promise<PaginatedResult<T>>;
