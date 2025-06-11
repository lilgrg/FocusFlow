import { Routine, UserSettings, UserStats, ApiResponse, ApiError } from './entities';

/**
 * API endpoints configuration
 */
export type ApiEndpoints = {
  routines: string;
  settings: string;
  statistics: string;
  auth: string;
};

/**
 * API request configuration
 */
export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
}

/**
 * API service interface
 */
export interface ApiService {
  getRoutines(): Promise<ApiResponse<Routine[]>>;
  getRoutine(id: string): Promise<ApiResponse<Routine>>;
  createRoutine(routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Routine>>;
  updateRoutine(id: string, routine: Partial<Routine>): Promise<ApiResponse<Routine>>;
  deleteRoutine(id: string): Promise<ApiResponse<void>>;
  getUserSettings(): Promise<ApiResponse<UserSettings>>;
  updateUserSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>>;
  getUserStats(): Promise<ApiResponse<UserStats>>;
}

/**
 * API error handler interface
 */
export interface ApiErrorHandler {
  handleError(error: ApiError): void;
  isApiError(error: unknown): error is ApiError;
}

/**
 * API response interceptor interface
 */
export interface ApiResponseInterceptor {
  onResponse<T>(response: ApiResponse<T>): ApiResponse<T>;
  onError(error: ApiError): ApiError;
} 