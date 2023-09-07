import { ei, FetchOptions as EIFetchOptions, FetchResponse } from '@bearei/ei';
import { HEADERS } from './headers';

export interface CreateFetchOptions {
  /**
   * The host of the Serverless function being called in this instance.
   */
  host: string;
}

export interface FetchOptions extends EIFetchOptions {
  /**
   * Whether to execute the Serverless function asynchronously.
   * This parameter specifies whether a single function call is asynchronous.
   */
  isAsync?: boolean;

  /**
   * Set the host for the Serverless function call."
   */
  host: string;
}

export interface CreatedFetch {
  eiFetch: typeof eiFetch;
}

const { processFetchHeaders } = HEADERS;
const eiFetch = (
  url: string,
  { method, data, isAsync = false, host, headers, ...args }: FetchOptions,
): Promise<FetchResponse> => {
  const processedHeaders = processFetchHeaders({
    isAsync,
    host,
    data,
  }) as Record<string, string>;

  return ei(url, {
    ...args,
    method,
    headers: { ...headers, ...processedHeaders },
    ...(data && { data }),
  });
};

const createFetch = (): CreatedFetch => ({ eiFetch });

export const FETCH = createFetch();
