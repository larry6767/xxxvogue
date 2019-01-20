import {put, takeEvery, select} from 'redux-saga/effects'

import {
    getProvedPageKey,
    getHeaderText,
    getPageData,
    immutableProvedGet as ig,
} from '../helpers'
import errorActions from '../../generic/ErrorMessage/actions'
import headerActions from '../MainHeader/actions'
import pornstarSaga from './Pornstar/sagas'
import actions from './actions'

export function* loadPornstarsPageFlow(action, ssrContext) {
    try {
        const reqData = yield select(x => ({
            localeCode: ig(x, 'app', 'locale', 'localeCode'),
            page: getProvedPageKey('pornstars'),
        }))

        let data
        if (yield select(x => ig(x, 'app', 'ssr', 'isSSR')))
            data = yield ssrContext.getPageData(reqData)
        else
            data = yield getPageData(reqData)

        yield put(headerActions.setNewText(getHeaderText(data)))
        yield put(actions.loadPageSuccess({data}))
    } catch (err) {
        console.error('loadPornstarsPageFlow is failed with exception:', err)
        yield put(actions.loadPageFailure())
        yield put(errorActions.openErrorMessage())
    }
}

export default function* saga() {
    yield takeEvery(actions.loadPageRequest, loadPornstarsPageFlow)
    yield pornstarSaga()
}
