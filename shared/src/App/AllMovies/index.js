import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {compose, withHandlers, withProps, withState, lifecycle} from 'recompose'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

// local libs
import {
    getHeaderWithOrientation,
    getRouterContext,
    plainProvedGet as g,
    immutableProvedGet as ig,
    PropTypes,
    setPropTypes,
    getHeaderText,
    getPageRequestParams,
    doesItHaveToBeReloaded,
    areWeSwitchedOnPage,
    breakpoints,
} from 'src/App/helpers'

import {model} from 'src/App/AllMovies/models'
import {routerContextModel, refModel} from 'src/App/models'
import routerGetters from 'src/App/routerGetters'
import orientationPortal from 'src/App/MainHeader/Niche/orientationPortal'
import sectionPortal from 'src/App/MainHeader/Navigation/sectionPortal'
import loadingWrapper from 'src/generic/loadingWrapper'
import ControlBar from 'src/generic/ControlBar'
import PageTextHelmet from 'src/generic/PageTextHelmet'
import Lists from 'src/generic/Lists'
import VideoList from 'src/generic/VideoList'
import {PageWrapperNextToList} from 'src/App/AllMovies/assets'
import headerActions from 'src/App/MainHeader/actions'
import actions from 'src/App/AllMovies/actions'
import {muiStyles} from 'src/App/AllMovies/assets/muiStyles'

const
    AllMovies = ({
        classes,
        cb,
        htmlLang,
        data,
        chooseSort,
        isSSR,
        sponsorLinkBuilder,
        controlLinkBuilder,
        controlArchiveLinkBuilder,
        controlBackFromArchiveLinkBuilder,
        listsTagLinkBuilder,
        listsArchiveLinkBuilder,
        i18nListNichesHeader,
        i18nListArchiveHeader,
        setPageWrapperRef,
        pageWrapperRef,
    }) => <Fragment>
        <PageTextHelmet htmlLang={htmlLang} pageText={ig(data, 'pageText')}/>
        {!pageWrapperRef && !isSSR ? null : <Lists
            cb={cb}
            maxHeight={!isSSR ? g(pageWrapperRef, 'clientHeight') : null}
            sponsorsList={ig(data, 'sponsorsList')}
            sponsorLinkBuilder={sponsorLinkBuilder}
            tagList={ig(data, 'tagList')}
            tagLinkBuilder={listsTagLinkBuilder}
            tagArchiveList={ig(data, 'tagArchiveList')}
            archiveLinkBuilder={listsArchiveLinkBuilder}
            i18nListNichesHeader={i18nListNichesHeader}
            i18nListArchiveHeader={i18nListArchiveHeader}
        />}

        <PageWrapperNextToList ref={setPageWrapperRef}>
            <Typography
                variant="h4"
                gutterBottom
                className={classes.typographyTitle}
            >
                {data.getIn(['pageText', 'listHeader'])}
            </Typography>
            <ControlBar
                linkBuilder={controlLinkBuilder}
                archiveLinkBuilder={controlArchiveLinkBuilder}
                backFromArchiveLinkBuilder={controlBackFromArchiveLinkBuilder}
                chooseSort={chooseSort}
                pagesCount={ig(data, 'pagesCount')}
                pageNumber={ig(data, 'pageNumber')}
                itemsCount={ig(data, 'itemsCount')}
                sortList={ig(data, 'sortList')}
                currentSort={ig(data, 'currentSort')}
                archiveFilms={ig(data, 'archiveFilms')}
                tagArchiveListOlder={ig(data, 'tagArchiveListOlder')}
                tagArchiveListNewer={ig(data, 'tagArchiveListNewer')}
            />
            <VideoList videoList={ig(data, 'videoList')}/>
            <ControlBar
                isDownBelow={true}
                linkBuilder={controlLinkBuilder}
                archiveLinkBuilder={controlArchiveLinkBuilder}
                backFromArchiveLinkBuilder={controlBackFromArchiveLinkBuilder}
                chooseSort={chooseSort}
                pagesCount={ig(data, 'pagesCount')}
                pageNumber={ig(data, 'pageNumber')}
                itemsCount={ig(data, 'itemsCount')}
                sortList={ig(data, 'sortList')}
                currentSort={ig(data, 'currentSort')}
                archiveFilms={ig(data, 'archiveFilms')}
                tagArchiveListOlder={ig(data, 'tagArchiveListOlder')}
                tagArchiveListNewer={ig(data, 'tagArchiveListNewer')}
            />
        </PageWrapperNextToList>
    </Fragment>,

    setNewPageFlow = (prevProps, nextProps) => {
        if (areWeSwitchedOnPage(prevProps, nextProps))
            nextProps.setNewText(getHeaderText(ig(nextProps.data, 'pageText'), true))
    },

    loadPageFlow = ({data, loadPage, routerContext, match}) => {
        const
            pageRequestParams = getPageRequestParams(routerContext, match)

        if (doesItHaveToBeReloaded(data, pageRequestParams))
            loadPage(pageRequestParams)
    }

export default compose(
    orientationPortal,
    sectionPortal,
    connect(
        state => ({
            cb: ig(state, 'app', 'ui', 'currentBreakpoint'),
            data: ig(state, 'app', 'allMovies'),
            isSSR: ig(state, 'app', 'ssr', 'isSSR'),
            routerContext: getRouterContext(state),
            htmlLang: ig(state, 'app', 'locale', 'i18n', 'htmlLangAttribute'),
            i18nListNichesHeader: getHeaderWithOrientation(state, 'listNiches'),
            i18nListArchiveHeader: ig(state, 'app', 'locale', 'i18n', 'headers', 'listArchive'),
        }),
        {
            loadPageRequest: g(actions, 'loadPageRequest'),
            setNewSort: g(actions, 'setNewSort'),
            setNewText: g(headerActions, 'setNewText'),
        }
    ),
    withState('pageWrapperRef', 'setPageWrapperRef', null),
    withProps(props => ({
        archiveParams: !(props.match.params[0] && props.match.params[1]) ? null : {
            year: Number(g(props, 'match', 'params', 0)),
            month: Number(g(props, 'match', 'params', 1)),
        },
    })),
    withHandlers({
        loadPage: props => pageRequestParams => props.loadPageRequest({pageRequestParams}),

        chooseSort: props => event => {
            event.preventDefault()
            props.setNewSort({
                newSortValue: event.target.value,
                archiveParams: g(props, 'archiveParams'),
            })
        },

        controlLinkBuilder: props => qsParams =>
            g(props, 'archiveParams') === null
            ? routerGetters.allMovies.link(
                g(props, 'routerContext'),
                qsParams,
                ['ordering', 'pagination']
            )
            : routerGetters.allMoviesArchive.link(
                g(props, 'routerContext'),
                g(props, 'archiveParams', 'year'),
                g(props, 'archiveParams', 'month'),
                qsParams,
                ['pagination']
            ),

        controlArchiveLinkBuilder: props => (year, month) =>
            routerGetters.allMoviesArchive.link(g(props, 'routerContext'), year, month, null),

        controlBackFromArchiveLinkBuilder: props => () =>
            routerGetters.allMovies.link(g(props, 'routerContext'), null),

        listsTagLinkBuilder: props => child =>
            routerGetters.niche.link(g(props, 'routerContext'), child, null),

        listsArchiveLinkBuilder: props => (year, month) =>
            routerGetters.allMoviesArchive.link(
                g(props, 'routerContext'),
                year,
                month,
                null
            ),

        sponsorLinkBuilder: props => sponsor =>
            routerGetters.site.link(g(props, 'routerContext'), sponsor, null)
    }),
    lifecycle({
        componentDidMount() {
            loadPageFlow(this.props)
            setNewPageFlow(null, this.props)
        },

        componentWillReceiveProps(nextProps) {
            loadPageFlow(nextProps)
            setNewPageFlow(this.props, nextProps)
        },
    }),
    withStyles(muiStyles),
    setPropTypes(process.env.NODE_ENV === 'production' ? null : {
        cb: PropTypes.oneOf(breakpoints),
        data: model,
        isSSR: PropTypes.bool,
        routerContext: routerContextModel,
        htmlLang: PropTypes.string,
        i18nListNichesHeader: PropTypes.string,
        i18nListArchiveHeader: PropTypes.string,
        pageWrapperRef: refModel,
        loadPageRequest: PropTypes.func,
        loadPage: PropTypes.func,
        setNewText: PropTypes.func,
        setNewSort: PropTypes.func,
        chooseSort: PropTypes.func,
        controlLinkBuilder: PropTypes.func,
        controlArchiveLinkBuilder: PropTypes.func,
        controlBackFromArchiveLinkBuilder: PropTypes.func,
        listsTagLinkBuilder: PropTypes.func,
        listsArchiveLinkBuilder: PropTypes.func,
        sponsorLinkBuilder: PropTypes.func,
        setPageWrapperRef: PropTypes.func,
    }),
    loadingWrapper({
        withLists: true,
        withControlBar: true,
        withMoviesList: true,
    })
)(AllMovies)
