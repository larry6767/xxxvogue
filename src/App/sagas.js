import {takeEvery, put} from 'redux-saga/effects'

import homeSaga from './Home/sagas'
import mainHeaderSaga from './MainHeader/sagas'
import allMoviesSaga from './AllMovies/sagas'
import allNichesSaga from './AllNiches/sagas'
import pornstarsSaga from './Pornstars/sagas'
import favoriteSaga from './Favorite/sagas'
import favoritePornstarsSaga from './FavoritePornstars/sagas'
import videoPageSaga from './VideoPage/sagas'
import findVideosSaga from './FindVideos/sagas'
import {
    getIdsForInitialFavoriteList,
    addIdToCookie,
    removeIdFromCookie,
} from './helpers'
import actions from './actions'
import favoriteActions from './Favorite/actions'
import favoritePornstarsActions from './FavoritePornstars/actions'

export function* addVideoToFavorite({payload: item}) {
    addIdToCookie('mcj_fav', item)
    yield put(actions.addVideoIdToFavorite(item.get('id')))
    yield put(favoriteActions.addToList(item))
}

export function* removeVideoFromFavorite({payload: id}) {
    removeIdFromCookie('mcj_fav', id)
    yield put(actions.removeVideoIdFromFavorite(id))
    yield put(favoriteActions.removeFromList(id))
}

export function* getFavoriteVideoList(action, ssrContext) {
    yield put(actions.setFavoriteVideoList(getIdsForInitialFavoriteList('mcj_fav')))
}

export function* addPornstarToFavorite({payload: item}) {
    addIdToCookie('mcj_fav_model', item)
    yield put(actions.addPornstarIdToFavorite(item.get('id')))
    yield put(favoritePornstarsActions.addToList(item))
}

export function* removePornstarFromFavorite({payload: id}) {
    removeIdFromCookie('mcj_fav_model', id)
    yield put(actions.removePornstarIdFromFavorite(id))
    yield put(favoritePornstarsActions.removeFromList(id))
}

export function* getFavoritePornstarList(action, ssrContext) {
    yield put(actions.setFavoritePornstarList(getIdsForInitialFavoriteList('mcj_fav_model')))
}

export default function* saga() {
    yield takeEvery(actions.getFavoriteVideoList, getFavoriteVideoList)
    yield takeEvery(actions.removeVideoFromFavorite, removeVideoFromFavorite)
    yield takeEvery(actions.addVideoToFavorite, addVideoToFavorite)
    yield takeEvery(actions.getFavoritePornstarList, getFavoritePornstarList)
    yield takeEvery(actions.removePornstarFromFavorite, removePornstarFromFavorite)
    yield takeEvery(actions.addPornstarToFavorite, addPornstarToFavorite)
    yield [
        homeSaga(),
        mainHeaderSaga(),
        allNichesSaga(),
        allMoviesSaga(),
        pornstarsSaga(),
        favoriteSaga(),
        favoritePornstarsSaga(),
        videoPageSaga(),
        findVideosSaga(),
    ]
}
