import { Err } from '@bearei/ei';
import { HttpTriggerInvokeOptions } from './invoke';

export type CreateProcessInvokeErrorOptions = Pick<
  HttpTriggerInvokeOptions,
  'serviceName' | 'functionName'
> &
  Partial<Pick<HttpTriggerInvokeOptions, 'path'>>;

export interface ProcessErrorOptions extends CreateProcessInvokeErrorOptions {
  /**
   * The request ID for the current invocation of the Serverless function
   */
  requestId?: string;
}

export interface ServerlessErr extends Err, Partial<ProcessErrorOptions> {
  /**
   * Custom error code when calling the Serverless function.
   */
  code?: number | string;

  /**
   * Serverless function call error.
   */
  error?: ServerlessErr;

  /**
   * Serverless function API call chain information.
   */
  chains?: ProcessErrorOptions[];
}

export interface CreatedError {
  createProcessInvokeError: typeof createProcessInvokeError;
}

const createErr = (
  error: ServerlessErr,
  { serviceName, functionName, requestId, path }: ProcessErrorOptions,
): ServerlessErr => {
  const status = error.status ?? 500;
  const statusText = error.statusText ?? '';
  const code =
    error.code || typeof error.code === 'number' ? error.code : status;

  const err = (error.status ? error : { error }) as ServerlessErr;
  const currentChains = [{ serviceName, functionName, path }];
  const message =
    error.message ?? `${serviceName}.${functionName}.${path} invoke failed`;

  const chains =
    err.chains && Array.isArray(err.chains)
      ? [...currentChains, ...err.chains]
      : currentChains;

  return Object.assign(new Error(), {
    ...err,
    status,
    statusText,
    code,
    serviceName,
    functionName,
    path,
    requestId,
    message,
    chains,
  });
};

const createProcessInvokeError =
  (options: CreateProcessInvokeErrorOptions) =>
  (error: ServerlessErr): never => {
    const headers = (error.headers ?? {}) as Record<string, string>;
    const requestId = headers['x-fc-request-id'];

    throw createErr(error, { ...options, requestId });
  };

const createError = (): CreatedError => ({
  createProcessInvokeError,
});

export const ERROR = createError();
