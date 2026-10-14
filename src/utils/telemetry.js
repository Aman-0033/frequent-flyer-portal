/**
 * Telemetry Simulation Utility
 * Ticket: ENG-163087
 *
 * Provides real-time event logging to console and UI event streams
 * for evaluator inspection and compliance monitoring.
 */

const telemetryListeners = new Set();
const telemetryHistory = [];

export function subscribeTelemetry(listener) {
  telemetryListeners.add(listener);
  return () => {
    telemetryListeners.delete(listener);
  };
}

export function getTelemetryHistory() {
  return [...telemetryHistory];
}

export function clearTelemetryHistory() {
  telemetryHistory.length = 0;
  telemetryListeners.forEach((fn) => fn({ type: '__CLEAR__' }));
}

export function logTelemetry(action, metadata = {}) {
  const event = {
    action,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  // Primary console telemetry as required by test suite & analytics spec
  console.log('[Analytics] User interacted with End-to-End Frequent Flyer Portal', event);

  telemetryHistory.unshift(event);
  if (telemetryHistory.length > 50) {
    telemetryHistory.pop();
  }

  telemetryListeners.forEach((listener) => {
    try {
      listener(event);
    } catch {
      // Ignore listener error
    }
  });

  return event;
}

export default logTelemetry;
