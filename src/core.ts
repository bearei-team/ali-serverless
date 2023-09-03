import { FetchOptions } from '@bearei/ei';
import { Invoke, INVOKE } from './invoke';

export interface ServerlessOptions extends Pick<FetchOptions, 'timeout'> {
  /**
   * The region of the accessed Serverless, for example, 'cn-chengdu'.
   */
  region: string;

  /**
   * Whether to access the Serverless function through the intranet.
   * Only Serverless functions within the same region can be accessed through the intranet.
   */
  isInternal?: boolean;

  /**
   * Whether to enable secure access. If enabled, access will be done over HTTPS;
   * otherwise, it will use HTTP. Default is true.
   */
  isSecure?: boolean;

  /**
   * Custom domain for the Serverless function, with a default value of fc.app.run.
   */
  domain?: string;
}

export interface Client {
  invoke: Invoke;
}

export const CREATE_CLIENT = (options: ServerlessOptions): Client => ({
  invoke: INVOKE(options),
});
