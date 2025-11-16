export type ApiErrorType = "network" | "server" | "data";

export interface ApiError {
  type: ApiErrorType;
  message: string;
}
