import { CREATE_CLIENT, ServerlessOptions } from '../src/core';

describe('core', () => {
  it('It should create a client with default options', () => {
    const options: ServerlessOptions = { region: 'cn-chengdu' };
    const client = CREATE_CLIENT(options);

    expect(client).toBeDefined();
    expect(client.invoke).toBeDefined();
  });
});
