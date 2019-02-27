import {fromJS, List, Map} from 'immutable'

import {provedHandleActions, plainProvedGet as g} from '../helpers'
import {model} from './models'
import actions from './actions'

export default provedHandleActions(model, {
        [g(actions, 'loadPageRequest')]: (state, {payload}) => state.merge({
            isLoading: true,
            isLoaded: false,
            isFailed: false,
            lastPageRequestParams: g(payload, 'pageRequestParams'),
            nichesList: List(),
            pageText: null,
        }),
        [g(actions, 'loadPageSuccess')]: (state, {payload}) => state.merge({
            isLoading: false,
            isLoaded: true,
            isFailed: false,
            lastPageRequestParams: g(payload, 'pageRequestParams'),
            nichesList: List(fromJS(g(payload, 'data', 'tagList'))),
            pageText: Map(g(payload, 'data', 'pageText')),
        }),
        [g(actions, 'loadPageFailure')]: (state) => state.merge({
            isLoading: false,
            isLoaded: false,
            isFailed: true,
            nichesList: List(),
            pageText: null,
        }),
    }, fromJS({
        isLoading: false,
        isLoaded: false,
        isFailed: false,
        lastPageRequestParams: null,
        nichesList: [],
        pageText: null,
    }))
