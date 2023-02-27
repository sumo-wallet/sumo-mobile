import Engine from '../../core/Engine';

const initialState = {
  backgroundState: {},
};

const sumoEngineReducer = (state = initialState, action) => {
  console.log('sumoEngineReducer:' + action.type);
  switch (action.type) {
    case 'SUMO_INIT_BG_STATE':
      return { backgroundState: Engine.state };
    case 'SUMO_UPDATE_BG_STATE': {
      const newState = { ...state };
      newState.backgroundState[action.key] = Engine.state[action.key];
      return newState;
    }
    default:
      return state;
  }
};

export default sumoEngineReducer;
