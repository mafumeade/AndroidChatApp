export const sendMessage = (to, text, from) => dispatch => {
  dispatch({
    type: "server/sendMessage",
    payload: { to, text },
  });

  dispatch({
    type: "SEND_MESSAGE",
    payload: { from, to, text, date: Date.now() },
  });
};

export const updateTypingStatus = (to, isTyping) => ({
  type: "server/updateTypingStatus",
  payload: { to, isTyping },
});

export const clearMessages = () => ({
  type: "CLEAR_MESSAGES",
});
