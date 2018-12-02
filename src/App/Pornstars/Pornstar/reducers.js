import {handleActions} from 'redux-actions'
import {fromJS, List, OrderedMap, Map} from 'immutable'
import actions from './actions'

export default
    handleActions({
        [actions.loadPageRequest]: (state, {payload}) => state.merge({
            isLoading: true,
            isLoaded: false,
            isFailed: false,
            currentPage: '',
            currentSubPage: '',
            lastSubPageForRequest: payload,
            pageNumber: 1,
            pageText: Map(),
            pagesCount: 1,
            tagList: List(),
            tagArchiveList: List(),
            sortList: List(),
            currentSort: '',
            archiveFilms: fromJS(),
            tagArchiveListOlder: fromJS(),
            tagArchiveListNewer: fromJS(),
            itemsCount: 0,
            videoList: List(),
        }),
        [actions.loadPageSuccess]: (state, {payload: {data, subPageForRequest}}) => state.merge({
            isLoading: false,
            isLoaded: true,
            isFailed: false,
            currentPage: data.currentPage,
            currentSubPage: data.currentSubPage,
            lastSubPageForRequest: subPageForRequest,
            pageNumber: data.pageNumber,
            pageText: Map(fromJS(data.pageText)),
            pagesCount: data.pagesCount,
            tagList: List(fromJS(data.tagList)),
            tagArchiveList: List(fromJS(data.tagArchiveList)),
            sortList: List(fromJS(data.sortList)),
            currentSort: data.currentSort,
            archiveFilms: fromJS(data.archiveFilms),
            tagArchiveListOlder: fromJS(data.tagArchiveListOlder),
            tagArchiveListNewer: fromJS(data.tagArchiveListNewer),
            itemsCount: data.itemsCount,
            videoList: List(fromJS(data.videoList)),
        }),
        [actions.loadPageFailure]: state => state.merge({
            isLoading: false,
            isLoaded: false,
            isFailed: true,
            currentPage: '',
            currentSubPage: '',
            lastSubPageForRequest: '',
            pageNumber: 1,
            pageText: OrderedMap(),
            pagesCount: 1,
            tagList: List(),
            tagArchiveList: List(),
            sortList: List(),
            currentSort: '',
            archiveFilms: fromJS(),
            tagArchiveListOlder: fromJS(),
            tagArchiveListNewer: fromJS(),
            itemsCount: 0,
            videoList: List(),
        }),
        [actions.setNewSort]: (state, {payload}) => state.set('currentSort', payload.newSortValue),
    }, fromJS({
        isLoading: false,
        isLoaded: false,
        isFailed: false,
        currentPage: '',
        currentSubPage: '',
        lastSubPageForRequest: '',
        pageNumber: 1,
        pageText: {
            /*
            description: '',
            headerDescription: '',
            headerTitle: '',
            keywords: '',
            listHeader: '',
            listHeaderEmpty: '',
            title: '',
            */
        },
        pagesCount: 1,
        tagList: [
            /*
            {
                id: 0,
                name: '',
                subPage: '',
                itemsCount: 0,
            }
            */
        ],
        tagArchiveList: [
            /*
            {
                archiveDate: 0,
                year: 0,
                month: '',
                monthNumber: 0,
                itemsCount: 0,
                url: '',
            }
            */
        ],
        sortList: [
            /*
            {
                active: false,
                value: '',
                localText: '',
            }
            */
        ],
        currentSort: '',
        archiveFilms: {
            /*
            {
                active: false,
                url: '',
            }
            */
        },
        tagArchiveListOlder: {
            /*
            {
                month: '',
                year: '',
            }
            */
        },
        tagArchiveListNewer: {
            /*
            {
                month: '',
                year: '',
            }
            */
        },
        itemsCount: 0,
        videoList: [
            /*
            {
                id: 0,
                thumb,
                title: '',
                sponsorId: 0,
                tags: '',
                tagsShort: '',
                urlRegular: '',
                favorite: 0,
                duration: 0,

            }
            */
        ],
    }))