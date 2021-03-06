import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {compose, lifecycle, withHandlers, onlyUpdateForKeys, withPropsOnChange} from 'recompose'
import FolderIcon from '@material-ui/icons/Folder'

import ListComponent from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'

// local libs
import {
    getHeaderText,
    withStylesProps,
    getRouterContext,
    immutableProvedGet as ig,
    plainProvedGet as g,
    PropTypes,
    setPropTypes,
    getPageRequestParams,
    doesItHaveToBeReloaded,
    areWeSwitchedOnPage,
} from 'src/App/helpers'

import {routerContextModel} from 'src/App/models'
import {model} from 'src/App/AllNiches/models'
import PageTextHelmet from 'src/generic/PageTextHelmet'
import routerGetters from 'src/App/routerGetters'
import headerActions from 'src/App/MainHeader/actions'
import actions from 'src/App/AllNiches/actions'
import sectionPortal from 'src/App/MainHeader/Navigation/sectionPortal'
import orientationPortal from 'src/App/MainHeader/Niche/orientationPortal'
import loadingWrapper from 'src/generic/loadingWrapper'
import {PageWrapper, StyledLink} from 'src/App/AllNiches/assets'
import {muiStyles} from 'src/App/AllNiches/assets/muiStyles'

const
    renderListItemLink = (x, classedBounds, getChildLink) => <StyledLink
        to={getChildLink(ig(x, 'subPage'))}
        key={ig(x, 'id')}
    >
        <ListItem
            button
            classes={g(classedBounds, 'listItem')}
        >
            <ListItemIcon>
                <FolderIcon/>
            </ListItemIcon>
            <ListItemText
                classes={g(classedBounds, 'listItemText')}
                primary={ig(x, 'name')}
                secondary={ig(x, 'itemsCount')}
            />
        </ListItem>
    </StyledLink>,

    AllNiches = props => <Fragment>
        <PageTextHelmet htmlLang={g(props, 'htmlLang')} pageText={ig(props.data, 'pageText')}/>
        <PageWrapper>
            <Typography variant="h4" gutterBottom>
                {g(props, 'i18nAllNichesHeader')}
            </Typography>
            <ListComponent
                component="div"
                classes={g(props, 'classedBounds', 'listComponent')}
            >
                {ig(props.data, 'nichesList').map(x =>
                    renderListItemLink(x, g(props, 'classedBounds'), g(props, 'getChildLink'))
                )}
            </ListComponent>
        </PageWrapper>
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
            data: ig(state, 'app', 'allNiches'),
            htmlLang: ig(state, 'app', 'locale', 'i18n', 'htmlLangAttribute'),
            i18nAllNichesHeader: ig(state, 'app', 'locale', 'i18n', 'headers', 'allNiches'),
            routerContext: getRouterContext(state),
        }),
        {
            loadPageRequest: g(actions, 'loadPageRequest'),
            setNewText: g(headerActions, 'setNewText'),
        }
    ),
    onlyUpdateForKeys(['data', 'cb']),
    withHandlers({
        loadPage: props => pageRequestParams => props.loadPageRequest({pageRequestParams}),
        getChildLink: props => child => routerGetters.niche.link(g(props, 'routerContext'), child),
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
    withStylesProps(muiStyles),
    withPropsOnChange([], props => ({
        classedBounds: Object.freeze({
            listComponent: Object.freeze({root: g(props, 'classes', 'listComponentRoot')}),
            listItem: Object.freeze({gutters: g(props, 'classes', 'itemGutters')}),
            listItemText: Object.freeze({
                root: g(props, 'classes', 'listItemTextRoot'),
                primary: g(props, 'classes', 'primaryTypography'),
                secondary: g(props, 'classes', 'secondaryTypography'),
            }),
        }),
    })),
    setPropTypes(process.env.NODE_ENV === 'production' ? null : {
        classes: PropTypes.exact({
            listComponentRoot: PropTypes.string,
            itemGutters: PropTypes.string,
            listItemTextRoot: PropTypes.string,
            primaryTypography: PropTypes.string,
            secondaryTypography: PropTypes.string,
        }),
        classedBounds: PropTypes.exact({
            listComponent: PropTypes.object,
            listItem: PropTypes.object,
            listItemText: PropTypes.object,
        }),
        cb: PropTypes.string,
        data: model,
        htmlLang: PropTypes.string,
        i18nAllNichesHeader: PropTypes.string,
        routerContext: routerContextModel,

        loadPageRequest: PropTypes.func,
        loadPage: PropTypes.func,
        setNewText: PropTypes.func,
        getChildLink: PropTypes.func,
    }),
    loadingWrapper({
        isAllNiches: true,
    })
)(AllNiches)
