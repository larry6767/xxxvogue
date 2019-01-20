import {pick, map, find, omit, compact, get, set} from 'lodash'
import fetch from 'node-fetch'
import FormData from 'form-data'

import {plainProvedGet as g, PropTypes, assertPropTypes} from '../App/helpers'
import {pageKeys} from '../App/models'
import {defaultHostToFetchSiteLocalesFrom} from '../config'
import apiLocales from '../locale-mapping/backend-api'
import {backendUrl, backendUrlForReport, backendUrlForSearch} from './helpers/backendUrl'
import {videoItemModel} from '../generic/VideoItem/models'
import {incomingVideoItemModel} from './helpers/requests/getFilteredVideoList'

import {
    incomingVideoPageTextModel,
    videoPageTextModel,
    getVideoPageText,
} from './helpers/requests/getPageText'

import {
    incomingGalleryModel,
    publishedTemplateModel,
    galleryModel,
} from './helpers/requests/getGallery'

import {
    getTagList,
    getTagListByLetters,
    getModelsList,
    getOrderingSortList,
    getFavoritesSortList,
    getFilteredVideoList,
    getPageText,
    getTagArchiveList,
    getArchiveFilms,
    getModelInfo,
    getGallery,
} from './helpers/requests'

const
    getHomeMap = x => ({
        nichesList: getTagList(x.page.TAGS_INFO.items),
        pornstarsList: getModelsList(
            g(x, 'page', 'MODELS_BY_LETTERS', 'letters'),
            g(x, 'page', 'MODELS_BY_LETTERS_MODELS_INFO', 'items'),
            true
        ),
        pageText: getPageText(x.page.PAGE_TEXT),
    }),

    // TODO FIXME: now i'm not shure about getting this data,
    // because on production we have some additional tags(i don't know yet where i should get it)
    // if we'll leave this implementation we need some additional logic,
    // because it's same data for AllNiches and Niche (we don't need to get twice from API)
    getAllNichesMap = x => ({
        tagList: getTagListByLetters(x.page.TAGS_BY_LETTERS.letters),
        pageText: getPageText(x.page.PAGE_TEXT),
    }),
    // sortBy(
    //     map(
    //         x.page.TAGS_INFO.items,
    //         ({id, name, sub_url, items_count}) => ({
    //             id,
    //             name,
    //             subPage: sub_url,
    //             itemsCount: items_count,
    //         })
    //     ),
    //     o => o.name
    // ),

    getAllMoviesMap = x => {
        const
            sortList = getOrderingSortList(g(x, 'page', 'ACTIVE_NAV_TABS')),
            tagArchiveListOlder = pick(g(x, 'page').TAG_ARCHIVE_OLDER, ['month', 'year']),
            tagArchiveListNewer = pick(g(x, 'page').TAG_ARCHIVE_NEWER, ['month', 'year']),
            archiveFilms = get(g(x, 'page', 'ACTIVE_NAV_TABS'), ['tag_archive_gals'], null)

        return {
            currentPage: x.page.TAG_URL_NAME,
            pageNumber: x.page.PAGE_NUMBER,
            pagesCount: x.page.PAGES_COUNT,
            pageText: getPageText(x.page.PAGE_TEXT),
            tagList: getTagListByLetters(x.page.TAGS_BY_LETTERS.letters),

            tagArchiveList: getTagArchiveList(
                get(g(x, 'page'), ['TAG_ARCHIVE_LIST_FULL'], g(x, 'page', 'TAG_ARCHIVE_LIST')),
                g(x, 'page', 'MONTHS_NAMES')
            ),

            tagArchiveListOlder:
                tagArchiveListOlder && Object.keys(tagArchiveListOlder).length
                    ? tagArchiveListOlder
                    : null,

            tagArchiveListNewer:
                tagArchiveListNewer && Object.keys(tagArchiveListNewer).length
                    ? tagArchiveListNewer
                    : null,

            sortList,
            currentSort:
                g(sortList, 'length') ? g(sortList.find(x => g(x, 'isActive')), 'code') : null,

            archiveFilms: archiveFilms && getArchiveFilms(archiveFilms),
            itemsCount: x.page.ITEMS_PER_PAGE,
            videoList: getFilteredVideoList(x.page.GALS_INFO.ids, x.page.GALS_INFO.items),
        }
    },

    getNicheMap = x => {
        const
            sortList = getOrderingSortList(g(x, 'page', 'ACTIVE_NAV_TABS')),
            tagArchiveListOlder = pick(g(x, 'page').TAG_ARCHIVE_OLDER, ['month', 'year']),
            tagArchiveListNewer = pick(g(x, 'page').TAG_ARCHIVE_NEWER, ['month', 'year']),
            archiveFilms = get(g(x, 'page', 'ACTIVE_NAV_TABS'), ['tag_archive_gals'], null)

        return {
            currentPage: 'all-niches',
            currentSubPage: g(x, 'page', 'TAG_URL_NAME'),
            pageNumber: g(x, 'page', 'PAGE_NUMBER'),
            pagesCount: g(x, 'page', 'PAGES_COUNT'),
            pageText: getPageText(g(x, 'page', 'PAGE_TEXT')),
            tagList: getTagListByLetters(g(x, 'page', 'TAGS_BY_LETTERS', 'letters')),

            tagArchiveList: getTagArchiveList(
                get(g(x, 'page'), ['TAG_ARCHIVE_LIST_FULL'], g(x, 'page', 'TAG_ARCHIVE_LIST')),
                g(x, 'page', 'MONTHS_NAMES')
            ),

            tagArchiveListOlder:
                tagArchiveListOlder && Object.keys(tagArchiveListOlder).length
                    ? tagArchiveListOlder
                    : null,

            tagArchiveListNewer:
                tagArchiveListNewer && Object.keys(tagArchiveListNewer).length
                    ? tagArchiveListNewer
                    : null,

            sortList,
            currentSort:
                g(sortList, 'length') ? g(sortList.find(x => g(x, 'isActive')), 'code') : null,

            archiveFilms: archiveFilms && getArchiveFilms(archiveFilms),
            itemsCount: g(x, 'page', 'ITEMS_PER_PAGE'),

            videoList: getFilteredVideoList(
                g(x, 'page', 'GALS_INFO', 'ids'),
                g(x, 'page', 'GALS_INFO', 'items')
            ),
        }
    },

    getPornstarMap = x => {
        const
            sortList = getOrderingSortList(g(x, 'page', 'ACTIVE_NAV_TABS'))

        return {
            currentSubPage: x.page.TAG_URL_NAME,
            pageNumber: x.page.PAGE_NUMBER,
            pageText: getPageText(x.page.PAGE_TEXT),
            pagesCount: x.page.PAGES_COUNT,

            sortList,
            currentSort:
                g(sortList, 'length') ? g(sortList.find(x => g(x, 'isActive')), 'code') : null,

            itemsCount: x.page.ITEMS_PER_PAGE,
            videoList: getFilteredVideoList(x.page.GALS_INFO.ids, x.page.GALS_INFO.items),
            modelsList: getModelsList(
                g(x, 'page', 'MODELS_BY_LETTERS', 'letters'),
                g(x, 'page', 'MODELS_BY_LETTERS_MODELS_INFO', 'items'),
                true
            ),
            modelInfo: getModelInfo(x.page.MODEL_INFO),
            modelThumb: x.page.MODEL_INFO.thumb_url,
        }
    },


    getPornstarsMap = x => ({
        modelsList: getModelsList(
            g(x, 'page', 'MODELS_BY_LETTERS', 'letters'),
            g(x, 'page', 'MODELS_BY_LETTERS_MODELS_INFO', 'items')
        ),
        pageText: getPageText(x.page.PAGE_TEXT),
    }),

    getFavoriteMap = x => {
        return {
            pageNumber: x.page.PAGE_NUMBER,
            pageText: getPageText(x.page.PAGE_TEXT),
            pagesCount: x.page.PAGES_COUNT,
            itemsCount: x.page.ITEMS_PER_PAGE,
            videoList: getFilteredVideoList(x.page.GALS_INFO.ids, x.page.GALS_INFO.items),
        }
    },

    getFavoritePornstarsMap = x => {
        return {
            pageNumber: x.page.PAGE_NUMBER,
            pageText: getPageText(x.page.PAGE_TEXT),
            pagesCount: x.page.PAGES_COUNT,
            itemsCount: x.page.ITEMS_PER_PAGE,
            modelsList: map(
                pick(
                    x.page.MODELS_BY_LETTERS_TAGS_INFO,
                    (Object.keys(x.page.MODELS_INFO.items))
                ),
                ({id, name, sub_url, items_count}) => ({
                    id: Number(id),
                    name,
                    subPage: sub_url,
                    itemsCount: Number(items_count),
                    thumb: x.page.MODELS_BY_LETTERS_MODELS_INFO.items[id].thumb_url,
                })
            )
        }
    },

    videoPageModel = process.env.NODE_ENV === 'production' ? null : PropTypes.shape({
        page: PropTypes.shape({
            GALLERY: incomingGalleryModel,
            PAGE_URL: PropTypes.string,
            TIME_AGO: publishedTemplateModel,
            PAGE_TEXT: incomingVideoPageTextModel,
            GALS_INFO: PropTypes.shape({
                ids: PropTypes.arrayOf(PropTypes.number),
                items: PropTypes.objectOf(incomingVideoItemModel),
            }),
        }),
    }),

    mappedVideoPageModel = process.env.NODE_ENV === 'production' ? null : PropTypes.shape({
        gallery: galleryModel,
        pageText: videoPageTextModel,
        videoList: PropTypes.arrayOf(videoItemModel),
    }),

    getVideoPageMap = x => {
        if (process.env.NODE_ENV !== 'production')
            assertPropTypes(videoPageModel, x, 'getVideoPageMap', 'video page source from backend')

        const
            result = {
                gallery: getGallery(
                    g(x, 'page', 'GALLERY'),
                    g(x, 'page', 'PAGE_URL'),
                    g(x, 'page', 'TIME_AGO')
                ),

                pageText: getVideoPageText(g(x, 'page', 'PAGE_TEXT')),

                videoList: getFilteredVideoList(
                    g(x, 'page', 'GALS_INFO', 'ids'),
                    g(x, 'page', 'GALS_INFO', 'items')
                ),
            }

        if (process.env.NODE_ENV !== 'production')
            assertPropTypes(
                mappedVideoPageModel,
                result,
                'getVideoPageMap',
                'mapped video page data'
            )

        return result
    },

    getFindVideosMap = x => {
        const
            sortList = getOrderingSortList(g(x, 'page', 'ACTIVE_NAV_TABS'))

        return {
            pageNumber: x.page.PAGE_NUMBER,
            pageText: getPageText(x.page.PAGE_TEXT),
            pagesCount: x.page.PAGES_COUNT,

            sortList,
            currentSort:
                g(sortList, 'length') ? g(sortList.find(x => g(x, 'isActive')), 'code') : null,

            itemsCount: x.page.ITEMS_PER_PAGE,
            videoList: getFilteredVideoList(x.page.GALS_INFO.ids, x.page.GALS_INFO.items),
        }
    },

    getPageDataParamsOptionsModel = process.env.NODE_ENV === 'production' ? null : PropTypes.exact({
        // for now it is the only option we use
        blocks: PropTypes.exact({
            allTagsBlock: PropTypes.number.isOptional,
            modelsABCBlockText: PropTypes.number.isOptional,
            modelsABCBlockThumbs: PropTypes.number.isOptional,
        }).isOptional,
    }),

    getPageDataParamsModel = process.env.NODE_ENV === 'production' ? null : PropTypes.exact({
        url: PropTypes.string,
        options: getPageDataParamsOptionsModel.isOptional,
    }),

    getPageDataResultModel = process.env.NODE_ENV === 'production' ? null : PropTypes.exactTuple([
        PropTypes.nullable(getPageDataParamsOptionsModel),
        PropTypes.func, // raw backend response to proper and filtered data map function
    ]),

    getPageDataReqBodyModel = process.env.NODE_ENV === 'production' ? null : PropTypes.exact({
        operation: PropTypes.string,
        params: getPageDataParamsModel,
    }),

    // `callStackGetter` supposed to be (() => new Error().stack) in place where it's called,
    // otherwise it's hard to debug which request is caused an exception.
    fetchResponseExtractor = callStackGetter => response => {
        if ( ! response.ok)
            throw new Error(
                `Response is not OK (status code is ${response.status}), ` +
                `call stack: ${callStackGetter()}`
            )

        return response.json()
    },

    getPageDataPageMappingModel = PropTypes.exact(
        pageKeys.reduce((o, k) => set(o, k, getPageDataResultModel), {})
    ),

    getPageDataPageMapping = Object.freeze({
        home: [
            {blocks: {allTagsBlock: 1, modelsABCBlockText: 1, modelsABCBlockThumbs: 1}},
            getHomeMap,
        ],
        allNiches: [{blocks: {allTagsBlock: 1}}, getAllNichesMap],
        niche: [{blocks: {allTagsBlock: 1}}, getNicheMap],
        allMovies: [{blocks: {allTagsBlock: 1}}, getAllMoviesMap],
        pornstars: [null, getPornstarsMap],
        pornstar: [
            {blocks: {modelsABCBlockText: 1, modelsABCBlockThumbs: 1}},
            getPornstarMap,
        ],
        favorite: [null, getFavoriteMap],
        favoritePornstars: [
            {blocks: {modelsABCBlockThumbs: 1}},
            getFavoritePornstarsMap,
        ],
        video: [null, getVideoPageMap],
        findVideos: [null, getFindVideosMap],
    }),

    getPageDataUrlBuilder = (localeCode, orientationCode, page, subPageCode) => {
        const
            pageCodeBranch = g(apiLocales, localeCode, 'pageCode', page),
            orientationPrefix = g(apiLocales, localeCode, 'orientationPrefixes', orientationCode),
            {code} = pageCodeBranch

        let
            url = g(pageCodeBranch, 'url')

        if (pageCodeBranch.hasOwnProperty('code'))
            url = url.replace(/%PAGE_CODE%/g, g(pageCodeBranch, 'code', orientationCode))

        if (subPageCode !== null)
            url = url.replace(/%SUB_PAGE_CODE%/g, subPageCode)

        return url.replace(/%ORIENTATION_PFX%/g, orientationPrefix)
    }

if (process.env.NODE_ENV !== 'production')
    assertPropTypes(
        getPageDataPageMappingModel,
        getPageDataPageMapping,
        'requests',
        'getPageDataPageMapping'
    )

/*
    Generic helper to obtain data from backend for specific "page".
*/
export const getPageData = (siteLocales, localeCode) => async ({
    headers,
    orientationCode,
    page,
    subPageCode = null, // optional
}) => {
    const
        url = getPageDataUrlBuilder(localeCode, orientationCode, page, subPageCode),
        result = g(getPageDataPageMapping, page)

    if (process.env.NODE_ENV !== 'production')
        assertPropTypes(getPageDataResultModel, result, 'requests', 'getPageData')

    const
        [options, mapFn] = result,
        body = {operation: 'getPageDataByUrl', params: {url}}

    if (options !== null)
        body.params.options = options

    if (process.env.NODE_ENV !== 'production')
        assertPropTypes(getPageDataReqBodyModel, body, 'requests', 'getPageData')

    return mapFn(await fetch(backendUrl(siteLocales, localeCode), {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    }).then(fetchResponseExtractor(() => new Error().stack)))
}

/*
    Requests a list of site locales which looks like this:
        [
            { title: 'English',  host: 'domain.com',    code: 'eng' },
            { title: 'Deutsch',  host: 'de.domain.com', code: 'deu' },
            { title: 'Italiano', host: 'it.domain.com', code: 'ita' },
            ...
        ]

    Actual result consists of this structure:
        {
            defaultLocaleCode: 'eng',
            locales: [
                // That list of locales mentioned above...
            ],
        }
*/
export const getSiteLocales = async () => {
    const
        {page: {CUSTOM_DATA: {langSites}}} = await fetch(
            backendUrl(
                [{host: defaultHostToFetchSiteLocalesFrom, code: '--PLUG--'}],
                '--PLUG--'
            ),
            {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    operation: 'getPageDataByUrl',
                    params: {
                        url: '',
                        options: {blocks: {langSites: 1}},
                    },
                }),
            }
        ).then(fetchResponseExtractor(() => new Error().stack)),

        defaultLocaleCode =
            find(map(langSites, ({active}, code) => ({code, active})), x => x.active).code

    return {
        defaultLocaleCode,
        locales: map(langSites, ({name, host}, code) => ({title: name, host, code})),
    }
}

export const sendReport = (siteLocales, localeCode) => ({headers, formData}) => fetch(
    backendUrlForReport(siteLocales, localeCode),
    {
        method: 'POST',
        headers,
        body:
            Object.keys(formData).reduce(
                (fd, k) => (fd.append(k, g(formData, k)), fd),
                new FormData()
            ),
    }
).then(fetchResponseExtractor(() => new Error().stack))

export const getSearchSuggestions = (siteLocales, localeCode) => async ({headers, formData}) => {
    const
        prepareData = x => compact(x) // 'compact' is for array with a single empty value, like ['']

    return prepareData(await fetch(
        `${backendUrlForSearch(siteLocales, localeCode)}?c=${
            g(formData, 'classId')}&t=${g(formData, 'searchKey')}`,
        {
            method: 'GET',
            headers,
        }
    ).then(fetchResponseExtractor(() => new Error().stack)))
}
