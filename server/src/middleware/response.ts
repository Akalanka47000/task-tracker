import os from 'os';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { default as context } from 'express-http-context';
import { ctxCorrelationId, headers } from '@shared/constants';

/**
 * @description Middleware function used to add the hostname and correlation id to the response headers
 * @returns void
 * @example
 * app.use(responseInterceptor);
 */
export const responseInterceptor = (_req, res, next) => {
  if (res.headersSent) return;
  res.set(headers.hostName, os.hostname());
  res.set(headers.correlationId, context.get(ctxCorrelationId));
  next();
};

export class FormattedResponse {
  /**
 * @description Formats and sends a response in a standardardized format.
 * @param res - The express response object (Optional)
 * @param status - The status code of the response. Defaults to 200
 * @param data - The data to be sent in the response if any
 * @param message - The message to be sent in the response
 */
  static send({ res, status = HttpStatus.OK, message, data }: {
    res?: Response;
    status?: number;
    message: string;
    data?: Record<string, any>;
  }) {
    const payload = { data, message };
    if (!payload.data) delete payload.data;
    if (res) return res.status(status).json(payload);
    return payload;
  }
}