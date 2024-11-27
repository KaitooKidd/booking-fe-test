type SuccessResponse<T> = { isSuccess: true; data: T; error?: never };
type ErrorResponse = { isSuccess: false; error: any; data?: never };
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

export type FetcherMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
