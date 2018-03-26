import * as types from '../constants/action_types';
import SittersService from '../services/sitters_service';

const sittersService = new SittersService();

export const getList = (start, size, minRating) => {
  return dispatch => {
    sittersService.getSittersByPageAndRating(start, size, minRating)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw true;
      })
      .then(sitters => dispatch({ type: types.SITTERS_GET_LIST, sitters }))
      .catch(() => dispatch({ type: types.SITTERS_SERVICE_ERROR }));
  };
}
