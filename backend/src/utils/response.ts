import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substring(2, 11).toUpperCase(),
        version: 'v1'
      }
    });
  }

  static error(res: Response, message = 'Error occurred', data: any = null, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: Math.random().toString(36).substring(2, 11).toUpperCase(),
        version: 'v1'
      }
    });
  }
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: any = null
) => {
  if (success) {
    return ApiResponse.success(res, data, message, statusCode);
  } else {
    return ApiResponse.error(res, message, data, statusCode);
  }
};
