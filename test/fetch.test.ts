import 'jest-fetch-mock';
import { FETCH, FetchOptions } from '../src/fetch';

const { eiFetch } = FETCH;

describe('fetch', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('It should make a synchronous fetch request with default options', async () => {
    const options: FetchOptions = {
      method: 'GET',
      host: 'example.com',
    };

    fetchMock.mockResponseOnce('Mocked Data', {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });

    const response = await eiFetch('https://example.com/api', options).catch(
      err => err,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBe('Mocked Data');
  });

  it('It should make an asynchronous fetch request with custom options', async () => {
    const options: FetchOptions = {
      method: 'POST',
      host: 'example.com',
      isAsync: true,
      data: { key: 'value' },
      headers: { 'Custom-Header': 'CustomValue' },
    };

    fetchMock.mockResponseOnce('Mocked Data', {
      status: 201,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });

    const response = await eiFetch('https://example.com/api', options);

    expect(response).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.data).toBe('Mocked Data');
  });

  it('It should be a failure in obtaining invocation data', async () => {
    const options: FetchOptions = {
      method: 'POST',
      host: 'example.com',
      isAsync: true,
      data: { key: 'value' },
      headers: { 'Custom-Header': 'CustomValue' },
    };

    fetchMock.mockResponseOnce('Precondition Failed', {
      status: 412,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });

    const response = await eiFetch('https://example.com/api', options).catch(
      err => err,
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(412);
    expect(response.data).toBe('Precondition Failed');
  });
});
