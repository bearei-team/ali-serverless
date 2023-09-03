import { HEADERS, ProcessFetchHeadersOptions } from '../src/headers';

const { processFetchHeaders } = HEADERS;

describe('headers', () => {
  it('It should create headers with default options', () => {
    const options: ProcessFetchHeadersOptions = {
      isAsync: false,
      host: 'example.com',
      data: null,
    };

    const headers = processFetchHeaders(options);

    expect(headers).toBeDefined();
    expect(headers.accept).toBe('*/*');
    expect(headers.host).toBe('example.com');
    expect(headers['user-agent']).toContain('Node.js');
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['x-fc-invocation-type']).toBeUndefined();
    expect(headers['content-length']).toBeUndefined();
  });

  it('It should create headers with custom options', () => {
    const options: ProcessFetchHeadersOptions = {
      isAsync: true,
      host: 'example.com',
      data: { key: 'value' },
    };

    const headers = processFetchHeaders(options);

    expect(headers).toBeDefined();
    expect(headers.accept).toBe('*/*');
    expect(headers.host).toBe('example.com');
    expect(headers['user-agent']).toContain('Node.js');
    expect(headers['content-type']).toBe('application/json; charset=utf-8');
    expect(headers['x-fc-invocation-type']).toBe('Async');
    expect(headers['content-length']).toBeDefined();
  });
});
