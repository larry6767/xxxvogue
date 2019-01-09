import {combineReducers} from 'redux-immutable'
import {handleActions} from 'redux-actions'
import actions from './actions'
import {fromJS, List} from 'immutable'
import {
    getCurrentBreakpoint,
    addIdToFavoriteList,
    removeIdFromFavoriteList,
    plainProvedGet as g,
} from './helpers'
import homeReducer from './Home/reducers'
import mainHeaderReducer from './MainHeader/reducers'
import allMoviesReducer from './AllMovies/reducers'
import nichesReducer from './AllNiches/reducers'
import pornstarsReducer from './Pornstars/reducers'
import favoriteReducer from './Favorite/reducers'
import favoritePornstarsReducer from './FavoritePornstars/reducers'

const
    defaultSSR = fromJS({isSSR: false})

export default combineReducers({
    home: homeReducer,
    mainHeader: mainHeaderReducer,
    niches: nichesReducer,
    allMovies: allMoviesReducer,
    pornstars: pornstarsReducer,
    favorite: favoriteReducer,
    favoritePornstars: favoritePornstarsReducer,

    ui: handleActions({
        [g(actions, 'resize')]: (state, action) =>
            state.set('currentBreakpoint', getCurrentBreakpoint(action.payload)),

        [g(actions, 'setFavoriteVideoList')]: (state, {payload: favoriteVideoList}) =>
            state.set('favoriteVideoList', List(favoriteVideoList)),
        [g(actions, 'addVideoIdToFavorite')]: (state, {payload: id}) =>
            addIdToFavoriteList(state, 'favoriteVideoList', id),
        [g(actions, 'removeVideoIdFromFavorite')]: (state, {payload: id}) =>
            removeIdFromFavoriteList(state, 'favoriteVideoList', id),

        [g(actions, 'setFavoritePornstarList')]: (state, {payload: favoritePornstarList}) =>
            state.set('favoritePornstarList', List(favoritePornstarList)),
        [g(actions, 'addPornstarIdToFavorite')]: (state, {payload: id}) =>
            addIdToFavoriteList(state, 'favoritePornstarList', id),
        [g(actions, 'removePornstarIdFromFavorite')]: (state, {payload: id}) =>
            removeIdFromFavoriteList(state, 'favoritePornstarList', id),
    }, fromJS({
        currentBreakpoint: getCurrentBreakpoint(),
        favoriteVideoList: List(),
        favoritePornstarList: List(),
    })),

    // static flag to detect if the app is running inside Server-Side Rendering
    ssr: (state = defaultSSR) => state,

    locale: combineReducers({
        localeCode: handleActions({
            [g(actions, 'setLocaleCode')]: (state, {payload}) => payload,
        }, null), // string

        /*
            This supposed to be filled at initialization step (depending on current locale).
            Example:
                { home:      'home'
                , allNiches: 'all-niches'
                , niche:     'niche'
                , ...
                }
        */
        pageCode: handleActions({
            [g(actions, 'fillLocalePageCodes')]: (state, {payload}) =>
                fromJS(payload),
        }, null),
    }),
})
