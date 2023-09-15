import 'jest-fetch-mock';
import {HttpTriggerInvokeOptions, Invoke, INVOKE, InvokeOptions} from '../src/invoke';

describe('invoke', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it('It should create an HTTP trigger invocation with default options', async () => {
        fetchMock.mockResponseOnce('Mocked Data', {
            headers: {'content-type': 'text/plain; charset=utf-8'},
        });

        const options: InvokeOptions = {
            region: 'us-west-1',
        };

        const httpTriggerOptions: HttpTriggerInvokeOptions = {
            serviceName: 'service',
            functionName: 'function',
            path: '/path',
            subdomain: 'mysubdomain',
        };

        const invoke: Invoke = INVOKE(options);
        const response = await invoke.httpTrigger(httpTriggerOptions);

        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.data).toBe('Mocked Data');
    });

    it('It should create an HTTP trigger invocation with custom options', async () => {
        fetchMock.mockResponseOnce('Mocked Data', {
            headers: {'content-type': 'text/plain; charset=utf-8'},
        });

        const options: InvokeOptions = {
            region: 'eu-central-1',
            isInternal: true,
            isSecure: false,
            domain: 'domain.com',
            timeout: 5000,
        };

        const httpTriggerOptions: HttpTriggerInvokeOptions = {
            serviceName: 'service',
            functionName: 'function',
            path: '/path',
            subdomain: 'subdomain',
            timeout: 3000,
        };

        const invoke: Invoke = INVOKE(options);
        const response = await invoke.httpTrigger(httpTriggerOptions);

        expect(response).toBeDefined();
        expect(response.status).toBe(200);
        expect(response.data).toBe('Mocked Data');
    });

    test('It should be a failure in obtaining invocation data', async () => {
        fetchMock.mockResponseOnce('Precondition Failed', {
            headers: {'content-type': 'text/plain; charset=utf-8'},
            status: 412,
            statusText: 'Precondition Failed',
        });

        const options: InvokeOptions = {
            region: 'eu-central-1',
            isInternal: true,
            isSecure: false,
            domain: 'domain.com',
            timeout: 5000,
        };

        const httpTriggerOptions: HttpTriggerInvokeOptions = {
            serviceName: 'service',
            functionName: 'function',
            path: '/path',
            subdomain: 'subdomain',
            timeout: 3000,
        };

        const invoke: Invoke = INVOKE(options);
        const response = await invoke.httpTrigger(httpTriggerOptions).catch(err => err);

        expect(response).toBeDefined();
        expect(response.status).toBe(412);
        expect(response.data).toBe('Precondition Failed');
        expect(response.serviceName).toBe('service');
        expect(response.functionName).toBe('function');
        expect(response.path).toBe('/path');
    });
});
