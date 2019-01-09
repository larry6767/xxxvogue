import {get} from 'lodash'
import {put, takeEvery, select} from 'redux-saga/effects'
import {BACKEND_URL} from '../../config'
import {getPageData, immutableProvedGet as ig} from '../helpers'
import errorActions from '../../generic/ErrorMessage/actions'

import actions from './actions'

export function* loadVideoPageFlow({payload: subPageForRequest}, ssrContext) {
    try {
        const
            reqData = yield select(x => ({
                localeCode: ig(x, 'app', 'locale', 'localeCode'),
                pageCode: ig(x, 'app', 'locale', 'pageCode', 'video'),
                subPageCode: subPageForRequest,
            }))

        let data

        if (yield select(x => ig(x, 'app', 'ssr', 'isSSR')))
            data = yield ssrContext.getPageData(reqData)
        else {
            const
                href = window.location.href,
                time = new Date().toLocaleString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                })

            data = yield getPageData(reqData)
            yield put(actions.setTimeAndHrefForReport({href, time}))
        }
        yield put(actions.loadPageSuccess({subPageForRequest, data}))
    } catch (err) {
        console.error('loadAllMoviesPageFlow is failed with exception:', err)
        yield put(actions.loadPageFailure())
        yield put(errorActions.openErrorMessage())
    }
}

export function* sendReportFlow({payload: formData}) {
    try {
        const
            data = yield fetch(`${BACKEND_URL}/send-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            }).then(response => {
                if (response.status !== 200)
                    throw new Error(`Response status is ${response.status} (not 200)`)

                return response.json()
            })

        if (get(data, 'success') === true) {
            yield put(actions.sendReportSuccess())
        } else {
            console.error('the report was not sent, try again')
            yield put(actions.sendReportFailure())
            yield put(errorActions.openErrorMessage())
        }
    } catch (err) {
        console.error('sendReportFlow is failed with exception:', err)
        yield put(actions.sendReportFailure())
        yield put(errorActions.openErrorMessage())
    }
}

export default function* saga() {
    yield takeEvery(actions.loadPageRequest, loadVideoPageFlow)
    yield takeEvery(actions.sendReportRequest, sendReportFlow)
}
