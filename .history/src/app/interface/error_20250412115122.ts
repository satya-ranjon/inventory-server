export type TErrorMessages = {
  path: string | number;
  message: string;
};

export type TGenericErrorResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  errorMessages?: TErrorMessages[];
  errorMessage?: string;
  stack?: string;
};
