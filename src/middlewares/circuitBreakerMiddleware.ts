// Types
import type {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ICircuitBreakerConfig,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IExtendedResponseConfig,
} from './circuitBreakerMiddleware.types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AxiosResponse, AxiosError } from 'axios';

// Default Config
const defaultConfig: ICircuitBreakerConfig = {
  failureThreshold: 2,
  successThreshold: 2,
  statusCodesToIgnore: [400, 401, 403, 409],
  timeout: 5000,
};

// Circuit Breaker
export const createCircuitBreaker = (config = defaultConfig) => {
  /** Current state of the circuit. */
  let state: 'closed' | 'half-open' | 'open' = 'closed';

  /** Number of errors encountered since the circuit closed. */
  let failureCount = 0;

  /** Number of successful calls made since the last state change. */
  let successCount = 0;

  /**
   * @method closeCircuit
   * @description Marks the state as closed
   */
  const closeCircuit = () => {
    state = 'closed';

    resetCounters();
  };

  /**
   * @method: halfOpenCircuit
   * @description: Marks the state as half-opened
   */
  const halfOpenCircuit = () => {
    state = 'half-open';

    resetCounters();
  };

  /**
   * @method openCircuit
   * @description Marks the state as open
   */
  const openCircuit = () => {
    state = 'open';

    resetCounters();
  };

  /**
   * @method startTimer
   * @description Starts the timer after which state will be changed to half-open
   */
  const startTimer = () => {
    setTimeout(() => halfOpenCircuit(), config.timeout);
  };

  /**
   * @method incrementFailureCount
   * @description Increments the failureCount by 1
   */
  const incrementFailureCount = () => {
    failureCount = failureCount + 1;
  };

  /**
   * @method incrementSuccessCount
   * @description Increments the successCount by 1
   */
  const incrementSuccessCount = () => {
    successCount = successCount + 1;
  };

  /**
   * @method resetCounters
   * @description Resets the success and failure counters
   */
  const resetCounters = () => {
    failureCount = 0;
    successCount = 0;
  };

  // On Request
  const onRequest = (
    request: IExtendedResponseConfig
  ): IExtendedResponseConfig => {
    if (state === 'open') {
      request.cancel = true;
    }

    console.log(state);

    return request;
  };

  // On Response
  const onResponse = (response: AxiosResponse): AxiosResponse => {
    // Increment Success Count
    incrementSuccessCount();

    // Check if circuit is half-open
    if (state === 'half-open') {
      // Is successThreshold enough to close the circuit?
      if (successCount === config.successThreshold) {
        // Mark the circuit as closed
        closeCircuit();
      }
    }

    return response;
  };

  // On Error
  const onError = (error: AxiosError): AxiosError => {
    const statusCode = error.response?.status || error.request?.status;

    if (statusCode && config.statusCodesToIgnore) {
      // Check if status code should be ignored?
      if (config.statusCodesToIgnore.includes(statusCode)) {
        // Return without touching circuit
        return error;
      }
    }

    // Increment Failure Count
    incrementFailureCount();

    // Is the circuit already in half-open state?
    // Is failureThreshold enough to open the circuit?
    if (state === 'half-open' || failureCount === config.failureThreshold) {
      // Mark the state as open
      openCircuit();

      // Start timer to half-open the circuit
      startTimer();
    }

    return error;
  };

  return {
    onRequest,
    onResponse,
    onError,
  };
};

// Exports
export default createCircuitBreaker;
