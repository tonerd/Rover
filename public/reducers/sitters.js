import * as types from '../constants/action_types'

export default function sitters(state = { list: [], totalItems: 0, pageSize: 10 }, action) {
  switch (action.type) {
    case types.SITTERS_GET_LIST:
      return Object.assign({}, state, {
        list: action.sitters.list,
        totalItems: action.sitters.total,
        serviceError: false
      });
    case types.SITTERS_SERVICE_ERROR:
      return Object.assign({}, state, {
        serviceError: true
      });
    default:
      return state;
  }
}
