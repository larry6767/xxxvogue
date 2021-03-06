import {all, takeEvery, put} from 'redux-saga/effects'
import {LOCATION_CHANGE} from 'connected-react-router'

// local libs
import homeSaga from 'src/App/Home/sagas'
import mainHeaderSaga from 'src/App/MainHeader/sagas'
import allNichesSaga from 'src/App/AllNiches/sagas'
import nicheSaga from 'src/App/Niche/sagas'
import pornstarsSaga from 'src/App/Pornstars/sagas'
import pornstarSaga from 'src/App/Pornstar/sagas'
import favoriteSaga from 'src/App/Favorite/sagas'
import favoritePornstarsSaga from 'src/App/FavoritePornstars/sagas'
import videoPageSaga from 'src/App/VideoPage/sagas'
import findVideosSaga from 'src/App/FindVideos/sagas'
import notFoundSaga from 'src/App/NotFound/sagas'
import reportDialogSaga from 'src/App/ReportDialog/sagas'

import {
    getIdsForInitialFavoriteList,
    addIdToCookie,
    removeIdFromCookie,
    immutableProvedGet as ig,
} from 'src/App/helpers'

import actions from 'src/App/actions'
import favoriteActions from 'src/App/Favorite/actions'
import favoritePornstarsActions from 'src/App/FavoritePornstars/actions'

export function* addVideoToFavorite({payload: item}) {
    addIdToCookie('mcj_fav', item)
    yield put(actions.addVideoIdToFavorite(ig(item, 'id')))
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
    yield put(actions.addPornstarIdToFavorite(ig(item, 'id')))
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

function scrollToTop() {
    window.scrollTo(0, 0)
}

export default function* saga() {
    yield takeEvery(actions.getFavoriteVideoList, getFavoriteVideoList)
    yield takeEvery(actions.removeVideoFromFavorite, removeVideoFromFavorite)
    yield takeEvery(actions.addVideoToFavorite, addVideoToFavorite)
    yield takeEvery(actions.getFavoritePornstarList, getFavoritePornstarList)
    yield takeEvery(actions.removePornstarFromFavorite, removePornstarFromFavorite)
    yield takeEvery(actions.addPornstarToFavorite, addPornstarToFavorite)
    yield takeEvery(LOCATION_CHANGE, scrollToTop)

    yield all([
        homeSaga(),
        mainHeaderSaga(),
        allNichesSaga(),
        nicheSaga(),
        pornstarsSaga(),
        pornstarSaga(),
        favoriteSaga(),
        favoritePornstarsSaga(),
        videoPageSaga(),
        findVideosSaga(),
        notFoundSaga(),
        reportDialogSaga(),
    ])
}
