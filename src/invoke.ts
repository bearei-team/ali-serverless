import { FetchResponse } from '@bearei/ei';
import { ServerlessOptions } from './core';
import { ERROR } from './error';
import { FETCH, FetchOptions } from './fetch';

export interface HttpTriggerInvokeOptions extends Omit<FetchOptions, 'host'> {
  /**
   * The name of the Serverless service.
   */
  serviceName: string;

  /**
   * The name of the Serverless function.
   */
  functionName: string;

  /**
   * The API path of the Serverless function to be invoked.
   */
  path: string;

  /**
   * Specify the subdomain for the Serverless function under the HTTP trigger.
   */
  subdomain: string;
}

export type CreateHttpTriggerInvokeOptions = ServerlessOptions;
export type InvokeOptions = ServerlessOptions;
export interface Invoke {
  httpTrigger: (options: HttpTriggerInvokeOptions) => Promise<FetchResponse>;
}

const { createProcessInvokeError } = ERROR;
const { eiFetch } = FETCH;
const createHttpTriggerInvoke =
  ({
    isInternal,
    isSecure = true,
    region,
    domain = 'fc.app.run',
    timeout: serverlessTimeout,
  }: CreateHttpTriggerInvokeOptions) =>
  ({
    serviceName,
    functionName,
    path,
    subdomain,
    timeout,
    ...args
  }: HttpTriggerInvokeOptions): Promise<FetchResponse> => {
    const protocol = isSecure ? 'https' : 'http';
    const network = isInternal ? '-internal' : '';
    const host = `${subdomain}.${region}${network}.${domain}`;
    const endpoint = `${protocol}://${host}`;
    const processInvokeError = createProcessInvokeError({
      serviceName,
      functionName,
      path,
    });

    return eiFetch(path, {
      ...args,
      host,
      baseURL: endpoint,
      timeout: timeout ?? serverlessTimeout,
    }).catch(processInvokeError);
  };

export const INVOKE = (options: InvokeOptions): Invoke => ({
  httpTrigger: createHttpTriggerInvoke(options),
});
