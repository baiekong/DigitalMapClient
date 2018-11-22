import io from 'socket.io-client';

export default function socketMiddleware(server) {
  const socket = io(server);

  return ({ dispatch }) => next => action => {
    if (typeof action === 'function') {
      return next(action);
    }

    const { event, leave, handle, emit, ...rest } = action;

    if (!event) {
      return next(action);
    }

    if (leave) {
      socket.removeListener(event);
      return;
    }

    if (emit) {
      socket.emit(event, action);
      return;
    }

    // Support both 'action string' and 'action function'
    // 'result attribute is the data sent from server'
    let handleEvent = handle;
    if (typeof handleEvent === 'string') {
      handleEvent = result => dispatch({ type: handle, result, ...rest });
    }

    return socket.on(event, handleEvent);
  };
}
