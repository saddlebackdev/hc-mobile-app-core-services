// Modules
import _ from 'lodash';

// States
export const States = {
  closed: 'closed',
  halfOpen: 'halfOpen',
  open: 'open',
};

const CircuitBreaker = (config: object | any) => {
  // Configurations
  if (!_.isObject(config)) {
    config = {};
  }

  // State
  // Current state of the circuit breaker
  let state = config.state || States.closed;

  // Failure Count
  // Number of errors made since circuit has been closed
  let failureCount = 0;

  // Failure Threshold
  // Number of errors it takes to open the circuit
  const failureThreshold = config.failureThreshold || 2;

  // Success Count
  // Number of successful calls made since last state change
  let successCount = 0;

  // Success Threshold
  // Number of successful calls required to close the circuit from half-open
  const successThreshold = config.successThreshold || 2;

  // Timeout in Milliseconds
  // How long should we wait before state changes from open to half-open
  const timeout = config.timeoutInMs || 15000;

  // Status Codes To Ignore
  // Status Codes which should not be counted towards failureCount
  const statusCodesToIgnore = config.statusCodesToIgnore || [400, 403, 404];

  // Failed error message
  // Reject the promise with this message
  const onErrorMessage =
    config.onErrorMessage ||
    'Something went wrong. Please try again in sometime.';

  // Close Circuit
  // Marks the state as closed
  function _closeCircuit() {
    state = States.closed;
  }

  // Half open Circuit
  // Marks the state as half-opened
  function _halfOpenCircuit() {
    state = States.halfOpen;
  }

  // Open Circuit
  // Marks the state as open
  function _openCircuit() {
    state = States.open;
  }

  // Start Timer
  // Starts the timer after which state will be changed to half-open
  function _startTimer() {
    setTimeout(() => {
      _halfOpenCircuit();
    }, timeout);
  }

  // Increment Failure Count
  function _incrementFailureCount() {
    failureCount = failureCount + 1;
  }

  // Increment Success Count
  function _incrementSuccessCount() {
    successCount = successCount + 1;
  }

  // Make Request
  async function makeRequest({ fallback, promise }: any) {
    // Check if state is open
    if (_.isEqual(state, States.open)) {
      // Call the fallback if it is provided
      if (_.isFunction(fallback)) {
        fallback();
      }

      // Reject the promise
      return Promise.reject({
        message: onErrorMessage,
      });
    }

    try {
      // Make the call
      const response = await promise();

      // Increment Success Count
      _incrementSuccessCount();

      // Check if circuit is half-open
      if (_.isEqual(state, States.halfOpen)) {
        // Is successThreshold enough to close the circuit?
        if (successCount >= successThreshold) {
          // Mark the circuit as closed
          _closeCircuit();
        }
      }

      // Resolve the promise
      return Promise.resolve(response);
    } catch (exception) {
      // Create error object
      const error: object = _.merge({}, exception);

      if (_.isObject(error) && error.response) {
        const statusCode = error!.response?.status;

        // Check if status code should be ignored?
        if (_.includes(statusCodesToIgnore, statusCode)) {
          // Return without touching circuit
          return Promise.reject(error);
        }
      }

      // Increment Failure Count
      _incrementFailureCount();

      // Is failureThreshold enough to open the circuit?
      if (failureCount >= failureThreshold) {
        // Mark the state as open
        _openCircuit();

        // Start timer to half-open the circuit
        _startTimer();
      }

      // Check if fallback is provided
      if (_.isFunction(fallback)) {
        fallback();
      }

      // Reject the promise
      return Promise.reject(error);
    }
  }

  return { makeRequest };
};

// Exports
export default CircuitBreaker;
