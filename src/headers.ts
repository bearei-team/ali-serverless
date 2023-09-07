import { FetchOptions } from './fetch';

export type ProcessFetchHeadersOptions = Pick<
  FetchOptions,
  'isAsync' | 'host' | 'data'
>;

export interface ProcessedFetchHeaders
  extends Record<string, string | undefined> {
  accept: string;
  date: string;
  host: string;
  'user-agent': string;
  'content-type': string;
  'content-length'?: string;
  'x-fc-invocation-type'?: string;
}

export interface CreatedHeaders {
  processFetchHeaders: typeof processFetchHeaders;
}

const processFetchHeaders = ({
  isAsync,
  host,
  data,
}: ProcessFetchHeadersOptions): ProcessedFetchHeaders => {
  const headers = {
    ...(isAsync && { 'x-fc-invocation-type': 'Async' }),
    ...(data && {
      'content-length': `${Buffer.byteLength(JSON.stringify(data))}`,
    }),
    accept: '*/*',
    date: new Date().toUTCString(),
    host,
    'user-agent': `Node.js(${process.version}) OS(${process.platform}/${process.arch})`,
    'content-type': 'application/json; charset=utf-8',
  };

  return headers;
};

const createHeaders = (): CreatedHeaders => ({
  processFetchHeaders,
});

export const HEADERS = createHeaders();
