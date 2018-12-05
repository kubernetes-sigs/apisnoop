export default {
  name: 'zach',
    getReducer: () => {
      const initialState = {
        nickName: 'Cool Zach, my Dear Friend.',
        isAwesome: true,
        favoriteMovie: 'Fired Up'
      }
      return((state = initialState, action) => {
        if (action.type === 'FAVORITE_MOVIE_CHANGED') {
          state = {
            ...state,
            favoriteMovie: action.payload
          }
        }
        return state
      })
    }
    ,
    selectFavoriteMovie: state => state.zach.favoriteMovie,
    selectNickName: state => state.zach.nickName,
    doChangeFavoriteMovie: () => ({ dispatch }) => {
      var favoriteMovies = [
        'Fired Up',
        'Sullivan\'s Travels',
        'The Big Lebowski',
        'Tully'
      ]
      dispatch({
        type: 'FAVORITE_MOVIE_CHANGED',
        payload: favoriteMovies[Math.floor(Math.random()*favoriteMovies.length)]
      })
    }
}
