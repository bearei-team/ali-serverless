import {ERROR, ServerlessErr} from '../src/error';

const {createProcessInvokeError} = ERROR;

describe('error', () => {
    it('It should create a process invoke error with request ID', () => {
        const options = {
            serviceName: 'service',
            functionName: 'function',
            path: '/',
        };

        const error: ServerlessErr = {
            status: 500,
            statusText: 'Internal Server Error',
            code: 1001,
            message: 'Function invocation failed',
            requestId: '123456',
            chains: [
                {
                    serviceName: 'service',
                    functionName: 'function',
                    path: '/',
                },
            ],
            request: new Request('http://bearei.com'),
        };

        const processInvokeError = createProcessInvokeError(options);

        try {
            processInvokeError(error);
        } catch (error) {
            const err = error as ServerlessErr;

            expect(err.status).toEqual(500);
            expect(err.code).toEqual(1001);
            expect(err.serviceName).toEqual('service');
            expect(err.functionName).toEqual('function');
            expect(err.code).toEqual(1001);
            expect(err.statusText).toEqual('Internal Server Error');
            expect(err.message).toEqual('Function invocation failed');
        }

        expect(() => processInvokeError(error)).toThrowError('Function invocation failed');
    });
});
