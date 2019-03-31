import {fromJS, List, Map} from 'immutable'

// local libs
import {provedHandleActions, plainProvedGet as g} from 'src/App/helpers'
import actions from 'src/App/AllMovies/actions'
import {model} from 'src/App/AllMovies/models'

export default
    provedHandleActions(model, {
        [g(actions, 'loadPageRequest')]: (state, {payload}) => state.merge({
            isLoading: true,
            isLoaded: false,
            isFailed: false,
            tagId: 0,
            currentPage: '',
            lastPageRequestParams: g(payload, 'pageRequestParams'),
            pageNumber: 1,
            pageText: null,
            pagesCount: 1,
            sponsorsList: List(),
            tagList: List(),
            tagArchiveList: List(),
            sortList: List(),
            currentSort: null,
            archiveFilms: null,
            tagArchiveListOlder: null,
            tagArchiveListNewer: null,
            itemsCount: 0,
            videoList: List(),
        }),
        [g(actions, 'loadPageSuccess')]: (state, {payload}) => {
            const
                archiveFilms = g(payload, 'data', 'archiveFilms'),
                tagArchiveListOlder = g(payload, 'data', 'tagArchiveListOlder'),
                tagArchiveListNewer = g(payload, 'data', 'tagArchiveListNewer')

            return state.merge({
                isLoading: false,
                isLoaded: true,
                isFailed: false,
                tagId: g(payload, 'data', 'tagId'),
                currentPage: g(payload, 'data', 'currentPage'),
                lastPageRequestParams: g(payload, 'pageRequestParams'),
                pageNumber: g(payload, 'data', 'pageNumber'),
                pageText: Map(g(payload, 'data', 'pageText')),
                pagesCount: g(payload, 'data', 'pagesCount'),
                sponsorsList: List(fromJS(g(payload, 'data', 'sponsorsList'))),
                tagList: List(fromJS(g(payload, 'data', 'tagList'))),
                tagArchiveList: List(fromJS(g(payload, 'data', 'tagArchiveList'))),
                sortList: List(fromJS(g(payload, 'data', 'sortList'))),
                currentSort: g(payload, 'data', 'currentSort'),
                archiveFilms: archiveFilms && Map(fromJS(archiveFilms)),
                tagArchiveListOlder: tagArchiveListOlder && Map(fromJS(tagArchiveListOlder)),
                tagArchiveListNewer: tagArchiveListNewer && Map(fromJS(tagArchiveListNewer)),
                itemsCount: g(payload, 'data', 'itemsCount'),
                videoList: List(fromJS(g(payload, 'data', 'videoList'))),
            })
        },
        [g(actions, 'loadPageFailure')]: state => state.merge({
            isLoading: false,
            isLoaded: false,
            isFailed: true,
            tagId: 0,
            currentPage: '',
            pageNumber: 1,
            pageText: null,
            pagesCount: 1,
            sponsorsList: List(),
            tagList: List(),
            tagArchiveList: List(),
            sortList: List(),
            currentSort: null,
            archiveFilms: null,
            tagArchiveListOlder: null,
            tagArchiveListNewer: null,
            itemsCount: 0,
            videoList: List(),
        }),
        [g(actions, 'setNewSort')]: (state, {payload}) =>
            state.set('currentSort', g(payload, 'newSortValue')),
    }, fromJS({
        isLoading: false,
        isLoaded: false,
        isFailed: false,
        tagId: 0,
        currentPage: '',
        lastPageRequestParams: null,
        pageNumber: 1,
        pageText: null,
        pagesCount: 1,
        sponsorsList: List(),
        tagList: [],
        tagArchiveList: [],
        sortList: [],
        currentSort: null,
        archiveFilms: null,
        tagArchiveListOlder: null,
        tagArchiveListNewer: null,
        itemsCount: 0,
        videoList: [],
    }))