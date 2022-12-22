const initialState = {
  showWarningAlert: false,
};

const dappReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_WARNING_ALERT':
      return {
        ...state,
        showWarningAlert: true,
      };
    default:
      return state;
  }
};
export default dappReducer;
