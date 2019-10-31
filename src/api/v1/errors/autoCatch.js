function auto(handler) {
  return (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);
}

export default function autoCatch(handlers) {
  if (typeof handlers === 'function') return auto(handlers);

  if (Array.isArray(handlers)) {
    return handlers.map(handler => auto(handler));
  }
  return Object.keys(handlers).reduce((autoHandlers, key) => {
    autoHandlers[key] = auto(handlers[key]);
    return autoHandlers;
  }, {});
}
