import React, {Fragment} from 'react'
import queryString from 'query-string'
import {get} from 'lodash'
import {connect} from 'react-redux'

import {compose, lifecycle, withHandlers, withState, withPropsOnChange} from 'recompose'

import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

import {
    getHeaderText,
    getRouterContext,
    immutableProvedGet as ig,
    plainProvedGet as g,
    getPageRequestParams,
    doesItHaveToBeReloaded,
    areWeSwitchedOnPage,
    setPropTypes,
    PropTypes,
    getOrientationByClassId,
} from '../helpers'

import {routerContextModel, legacyOrientationPrefixesModel} from '../models'
import {model} from './models'
import routerGetters from '../routerGetters'
import orientationPortal from '../MainHeader/Niche/orientationPortal'
import sectionPortal from '../MainHeader/Navigation/sectionPortal'
import loadingWrapper from '../../generic/loadingWrapper'
import ControlBar from '../../generic/ControlBar'
import PageTextHelmet from '../../generic/PageTextHelmet'
import VideoList from '../../generic/VideoList'
import {PageWrapper, StyledLink} from './assets'
import headerActions from '../MainHeader/actions'
import actions from './actions'
import {muiStyles} from './assets/muiStyles'

const
    FindVideos = props => <Fragment>
        <PageTextHelmet htmlLang={g(props, 'htmlLang')} pageText={ig(props.data, 'pageText')}/>
        <PageWrapper>
            {g(props, 'isSSR') ? null : <Snackbar
                anchorOrigin={g(props, 'snackbarPosition')}
                open={g(props, 'complexSnackbarState')}
                message={g(props, 'snackbarText')}
                action={g(props, 'buttonsArray')}
            />}
            <Typography
                variant="h4"
                gutterBottom
                className={g(props, 'classes', 'typographyTitle')}
            >
                {ig(props.data, 'pageText', 'listHeader')}
            </Typography>
            <ControlBar
                chooseSort={g(props, 'chooseSort')}
                pagesCount={ig(props.data, 'pagesCount')}
                pageNumber={ig(props.data, 'pageNumber')}
                itemsCount={ig(props.data, 'itemsCount')}
                sortList={ig(props.data, 'sortList')}
                currentSort={ig(props.data, 'currentSort')}
                archiveFilms={null}
                tagArchiveListOlder={null}
                tagArchiveListNewer={null}
                linkBuilder={g(props, 'controlLinkBuilder')}
                archiveLinkBuilder={null}
            />
            <VideoList videoList={ig(props.data, 'videoList')}/>
            {g(ig(props.data, 'videoList'), 'size') < 20 ? null : <ControlBar
                isDownBelow={true}
                chooseSort={g(props, 'chooseSort')}
                pagesCount={ig(props.data, 'pagesCount')}
                pageNumber={ig(props.data, 'pageNumber')}
                itemsCount={ig(props.data, 'itemsCount')}
                sortList={ig(props.data, 'sortList')}
                currentSort={ig(props.data, 'currentSort')}
                archiveFilms={null}
                tagArchiveListOlder={null}
                tagArchiveListNewer={null}
                linkBuilder={g(props, 'controlLinkBuilder')}
                archiveLinkBuilder={null}
            />}
        </PageWrapper>
    </Fragment>,

    setNewPageFlow = (prevProps, nextProps) => {
        if (areWeSwitchedOnPage(prevProps, nextProps)) {
            nextProps.setSnackbarIsOpen(true)
            nextProps.setNewText(getHeaderText(ig(nextProps.data, 'pageText'), true))
        }
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
            data: ig(state, 'app', 'findVideos'),
            htmlLang: ig(state, 'app', 'locale', 'i18n', 'htmlLangAttribute'),
            routerContext: getRouterContext(state),
            i18nYesButton: ig(state, 'app', 'locale', 'i18n', 'buttons', 'agree'),
            i18nOrientationSuggestionText:
                ig(state, 'app', 'locale', 'i18n', 'search', 'orientationSuggestion'),
            i18nOrientations: ig(state, 'app', 'locale', 'i18n', 'orientation'),
        }),
        {
            loadPageRequest: g(actions, 'loadPageRequest'),
            setNewSort: g(actions, 'setNewSort'),
            setNewText: g(headerActions, 'setNewText'),
        }
    ),
    withState('snackbarIsOpen', 'setSnackbarIsOpen', true),
    withPropsOnChange(['data'], props => {
        const
            searchQueryQsKey = ig(props.routerContext, 'router', 'searchQuery', 'qsKey'),
            qs = queryString.parse(ig(props.routerContext, 'location', 'search')),
            i18nOrientationSuggestion = ! ig(props.data, 'orientationSuggestion') ? null :
                ig(props.i18nOrientations, getOrientationByClassId(
                    ig(props.data, 'orientationSuggestion'))
                )

        return {
            searchQuery: get(qs, [searchQueryQsKey], ''),
            i18nOrientationSuggestion,
        }
    }),
    withPropsOnChange([], props => ({
        snackbarPosition: Object.freeze({
            vertical: 'top',
            horizontal: 'right'
        }),
    })),
    withHandlers({
        loadPage: props => pageRequestParams => props.loadPageRequest({pageRequestParams}),

        chooseSort: props => event => {
            event.preventDefault()
            props.setNewSort({
                newSortValue: event.target.value,
            })
        },

        closeSnackbar: props => event => {
            props.setSnackbarIsOpen(false)
        },

        runSearchLinkBuilder: props => () => routerGetters.findVideos.link(
            g(props, 'routerContext'),
            {searchQuery: g(props, 'searchQuery')},
            ['searchQuery'],
            ! ig(props.data, 'orientationSuggestion') ? null :
                getOrientationByClassId(ig(props.data, 'orientationSuggestion')),
        ),

        controlLinkBuilder: props => qsParams => routerGetters.findVideos.link(
            g(props, 'routerContext'),
            qsParams,
            ['ordering', 'pagination', 'searchQuery']
        ),
    }),
    withPropsOnChange(['data'], props => {
        const
            buttonsArray = [
                <StyledLink
                    key="agree"
                    to={props.runSearchLinkBuilder()}
                    onClick={g(props, 'closeSnackbar')}
                >
                    <Button color="secondary" size="small">
                        {g(props, 'i18nYesButton')}
                    </Button>
                </StyledLink>,
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={g(props, 'closeSnackbar')}
                >
                    <CloseIcon />
                </IconButton>,
            ],
            snackbarText = g(props, 'i18nOrientationSuggestionText')
                .replace('%SEARCH_QUERY%', g(props, 'searchQuery'))
                .replace('%ORIENTATION%', g(props, 'i18nOrientationSuggestion'))

        return {
            buttonsArray,
            snackbarText,
        }
    }),
    withPropsOnChange(['data', 'snackbarIsOpen'], props => ({
        complexSnackbarState: Boolean(ig(props.data, 'orientationSuggestion') &&
                g(props, 'snackbarIsOpen'))
    })),
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
        classes: PropTypes.exact({
            typographyTitle: PropTypes.string,
        }),
        isSSR: PropTypes.bool,
        data: model,
        htmlLang: PropTypes.string,
        routerContext: routerContextModel,
        snackbarIsOpen: PropTypes.bool,
        i18nYesButton: PropTypes.string,
        i18nOrientationSuggestionText: PropTypes.string,
        i18nOrientations: legacyOrientationPrefixesModel,
        searchQuery: PropTypes.string,
        i18nOrientationSuggestion: PropTypes.nullable(PropTypes.string),
        snackbarPosition: PropTypes.exact({
            vertical: PropTypes.string,
            horizontal: PropTypes.string,
        }),
        snackbarText: PropTypes.string,
        buttonsArray: PropTypes.arrayOf(PropTypes.node),
        complexSnackbarState: PropTypes.bool,

        loadPageRequest: PropTypes.func,
        loadPage: PropTypes.func,
        setNewSort: PropTypes.func,
        chooseSort: PropTypes.func,
        setNewText: PropTypes.func,
        controlLinkBuilder: PropTypes.func,
        runSearchLinkBuilder: PropTypes.func,
        setSnackbarIsOpen: PropTypes.func,
    }),
    loadingWrapper({
        withControlBar: true,
        withMoviesList: true,
    })
)(FindVideos)
