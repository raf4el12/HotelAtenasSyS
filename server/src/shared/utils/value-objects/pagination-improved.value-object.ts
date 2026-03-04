import { PaginatedResult } from '../../domain/interfaces/paginated-result.interface.js';

export class PaginationImproved {
  public readonly searchValue?: string;
  public readonly currentPage: number;
  public readonly pageSize: number;
  public readonly orderBy?: string;
  public readonly orderByMode?: string;

  constructor(
    searchValue?: string,
    currentPage: number = 1,
    pageSize: number = 10,
    orderBy?: string,
    orderByMode?: string,
  ) {
    this.searchValue = searchValue;
    this.currentPage = Math.max(1, currentPage);
    this.pageSize = Math.min(100, Math.max(1, pageSize));
    this.orderBy = orderBy;
    this.orderByMode = orderByMode;
  }

  getOffsetLimit(): { limit: number; offset: number } {
    return {
      limit: this.pageSize,
      offset: (this.currentPage - 1) * this.pageSize,
    };
  }

  formatResponse<T>(data: { rows: T[]; count: number }): PaginatedResult<T> {
    return {
      totalRows: data.count,
      rows: data.rows,
      totalPages: Math.ceil(data.count / this.pageSize),
      currentPage: this.currentPage,
    };
  }

  getOrderBy(defaultField: string = 'createdAt'): Record<string, string> {
    return { [this.orderBy ?? defaultField]: this.orderByMode ?? 'desc' };
  }

  hasSearch(): boolean {
    return !!this.searchValue && this.searchValue.trim().length > 0;
  }
}
