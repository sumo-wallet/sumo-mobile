export const initialState = {
  showWarningAlert: false,
  favorites: [],
};

const dappReducer = (state = initialState, action) => {
  const { favorites } = state;
  switch (action.type) {
    case 'SHOW_WARNING_ALERT':
      return {
        ...state,
        showWarningAlert: true,
      };
    case 'ADD_FAVORITE_DAPP': {
      if (favorites && favorites.length > 0) {
        const index = favorites.findIndex(
          (item) => item.website === action.dapp.website,
        );
        if (index <= 0) {
          return { ...state, favorites: favorites.push(action.dapp) };
        }
        return state;
      }
      return { ...state, favorites: [action.dapp] };
    }
    case 'REMOVE_FAVORITE_DAPP': {
      return {
        ...state,
        favorites: favorites.filter((item) => item.id !== action.dapp.id),
      };
    }

    default:
      return state;
  }
};
export default dappReducer;
