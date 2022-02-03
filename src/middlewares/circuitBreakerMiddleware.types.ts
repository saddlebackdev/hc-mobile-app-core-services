// Types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AxiosRequestConfig } from 'axios';

// Extended Response Config
export interface IExtendedResponseConfig extends AxiosRequestConfig {
  /** When true, cancels/aborts the http call */
  cancel?: boolean;
}

// Circuit Breaker Config
export interface ICircuitBreakerConfig {
  /** Number of errors it takes to open the circuit. */
  failureThreshold: number;

  /** Number of successful calls required to close the circuit from half-open. */
  successThreshold?: number;

  /** How long should we wait before state changes from open to half-open. */
  timeout?: number;

  /** Status Codes which should not be counted towards failureCount. */
  statusCodesToIgnore?: Array<number>;
}
