// TODO: this page needs propTypes
import React from 'react'
import {connect} from 'react-redux'
import {compose, lifecycle, withHandlers} from 'recompose'
import {withStyles} from '@material-ui/core'
import {CircularProgress, Typography} from '@material-ui/core'
import {Record} from 'immutable'

import {
    getHeaderText,
    getRouterContext,
    plainProvedGet as g,
    immutableProvedGet as ig,
    PropTypes,
    ImmutablePropTypes,
    setPropTypes,
    getPageRequestParams,
    doesItHaveToBeReloaded,
    areWeSwitchedOnPage,
    breakpoints,
    voidPagePlug,
} from '../helpers'

import {immutableI18nButtonsModel, routerContextModel} from '../models'
import routerGetters from '../routerGetters'
import orientationPortal from '../MainHeader/Niche/orientationPortal'
import sectionPortal from '../MainHeader/Navigation/sectionPortal'
import ControlBar from '../../generic/ControlBar'
import ErrorContent from '../../generic/ErrorContent'
import PageTextHelmet from '../../generic/PageTextHelmet'
import VideoList from '../../generic/VideoList'
import {Page, Content, PageWrapper} from './assets'
import headerActions from '../MainHeader/actions'
import actions from './actions'
import {muiStyles} from './assets/muiStyles'

const
    DataRecord = Record({
        isLoading: null,
        isLoaded: null,
        isFailed: null,

        lastPageRequestParams: null,

        pageText: null,
        pageNumber: null,
        pagesCount: null,
        itemsCount: null,
        videoList: null,
    }),

    Favorite = ({
        classes,
        cb,
        isSSR,
        i18nButtons,
        i18nLabelShowing,
        data,
        controlLinkBuilder,
        controlFavoriteLinkBuilder,
    }) => <Page>
        { ig(data, 'isFailed')
            ? <ErrorContent/>
            : ig(data, 'isLoading')
            ? <CircularProgress/>
            : <Content>
                <PageTextHelmet pageText={ig(data, 'pageText')}/>
                <PageWrapper>
                    <Typography
                        variant="h4"
                        gutterBottom
                        classes={{
                            root: g(classes, 'typographyTitle'),
                        }}
                    >
                        {g(ig(data, 'videoList'), 'size')
                            ? `${(ig(data, 'pageText', 'listHeader') || '')
                                .replace(/[0-9]/g, '')}${g(ig(data, 'videoList'), 'size')}`
                            : ig(data, 'pageText', 'listHeaderEmpty')
                        }
                    </Typography>
                    <ControlBar
                        isSSR={isSSR}
                        cb={cb}
                        i18nButtons={i18nButtons}
                        i18nLabelShowing={i18nLabelShowing}
                        linkBuilder={controlLinkBuilder}
                        favoriteLinkBuilder={controlFavoriteLinkBuilder}
                        pagesCount={ig(data, 'pagesCount')}
                        pageNumber={ig(data, 'pageNumber')}
                        itemsCount={ig(data, 'itemsCount')}
                        favoriteButtons={true}
                    />
                    <VideoList
                        videoList={ig(data, 'videoList')}
                    />
                </PageWrapper>
            </Content>
        }
    </Page>,

    setNewPageFlow = (prevProps, nextProps) => {
        if (areWeSwitchedOnPage(prevProps, nextProps))
            nextProps.setNewText(getHeaderText(g(nextProps, 'data'), true))
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
            isSSR: ig(state, 'app', 'ssr', 'isSSR'),
            cb: ig(state, 'app', 'ui', 'currentBreakpoint'),
            routerContext: getRouterContext(state),
            i18nButtons: ig(state, 'app', 'locale', 'i18n', 'buttons'),
            i18nLabelShowing: ig(state, 'app', 'locale', 'i18n', 'labels', 'showing'),
            data: DataRecord(ig(state, 'app', 'favorite')),
        }),
        {
            loadPageRequest: g(actions, 'loadPageRequest'),
            setNewText: g(headerActions, 'setNewText'),
        }
    ),
    withHandlers({
        loadPage: props => pageRequestParams => props.loadPageRequest({pageRequestParams}),

        controlLinkBuilder: props => qsParams =>
            routerGetters.favorite.link(
                g(props, 'routerContext'),
                {...qsParams},
                ['pagination']
            ),

        controlFavoriteLinkBuilder: props => section =>
            g(routerGetters, section).link(g(props, 'routerContext'), null),
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
        isSSR: PropTypes.bool,
        cb: PropTypes.oneOf(breakpoints),
        routerContext: routerContextModel,
        i18nButtons: immutableI18nButtonsModel,
        i18nLabelShowing: PropTypes.string,
        data: ImmutablePropTypes.record, // TODO better type
        controlLinkBuilder: PropTypes.func,
        controlFavoriteLinkBuilder: PropTypes.func,
        loadPageRequest: PropTypes.func,
        loadPage: PropTypes.func,
    }),
    voidPagePlug
)(Favorite)
