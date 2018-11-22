export function subscribeEvent(event) {
    return {
      event: event,
      handle: 'WS_MESSAGE'
    }
  }
  
  export function unsubscribeEvent(event) {
    return {
      event: event,
      leave: true,
    }
  }
  
  export function sentDataOnEvent(event, data) {
    return {
      event: event,
      emit: true,
      data: data
    }
  }

  // Action creator with received function:
  /*export function subscribeWithFunction() {
    return dispatch => dispatch({
      event: 'message',
      handle: data => dispatch({
        type: NEW_MESSAGE,
        payload: data.message,
      }),
    });
  }*/