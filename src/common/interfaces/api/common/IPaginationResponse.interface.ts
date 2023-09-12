/**
 * @brief   Interface for pagination response
 * @generic T: Type of content
 */
export interface IPaginationResponse<T> {
  content: T[];
  page: {
    take: number;
    page: number;
    totalPage: number;
    currentPage: number;
    isLast: boolean;
  };
}
