import React, {Fragment} from 'react'
import {compose, withHandlers, withState, withPropsOnChange} from 'recompose'
import {connect} from 'react-redux'
import {animateScroll} from 'react-scroll'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import Favorite from '@material-ui/icons/Favorite'
import HomeIcon from '@material-ui/icons/Home'
import ReportIcon from '@material-ui/icons/Report'

import {
    plainProvedGet as g,
    immutableProvedGet as ig,
    getRouterContext,
    PropTypes,
    ImmutablePropTypes,
    setPropTypes,
    getPageRequestParams,
    doesItHaveToBeReloaded,
    breakpoints,
    compareCurrentBreakpoint as ccb,
    breakpointXS as xs,
    breakpointSM as sm,
    breakpointMD as md,
    getHeaderText,
    lifecycleForPageWithRefs,
} from '../helpers'

import routerGetters from '../routerGetters'

import {model} from './models'
import {immutableI18nButtonsModel, routerContextModel} from '../models'
import orientationPortal from '../MainHeader/Niche/orientationPortal'
import sectionPortal from '../MainHeader/Navigation/sectionPortal'
import loadingWrapper from '../../generic/loadingWrapper'
import PageTextHelmet from '../../generic/PageTextHelmet'
import VideoList from '../../generic/VideoList'

import headerActions from '../MainHeader/actions'
import actions from './actions'
import appActions from '../actions'
import reportDialogActions from '../ReportDialog/actions'
import {muiStyles} from './assets/muiStyles'

import {
    StyledLink,
    PageWrapper,
    PlayerSection,
    VideoPlayer,
    VideoWrapper,
    Video,
    ControlPanel,
    ControlPanelBlock,
    Advertisement,
    RelatedVideos,
    BottomAdvertisement,
    InlineAdvertisementWrapper,
    InlineAdvertisement,
    CloseAdvertisement,
    AdGag,
    TagsWrapper,
    SponsorLink,
    VideoIframe,
    AdIframeWrapper,
    AdIframe,
} from './assets'

const
    renderFavoriteButton = (
        classedBounds,
        data,
        favoriteVideoList,
        addVideoToFavoriteHandler,
        removeVideoFromFavoriteHandler,
        i18nButtons,
    ) => favoriteVideoList.find(id => id === ig(data, 'gallery', 'id'))
        ? <Button
            variant="contained"
            color="primary"
            classes={g(classedBounds, 'buttonFavorite')}
            onClick={removeVideoFromFavoriteHandler}
        >
            <Favorite classes={g(classedBounds, 'favoriteIcon')}/>
            {ig(i18nButtons, 'removeFromFavorite')}
        </Button>
        : <Button
            variant="contained"
            color="primary"
            classes={g(classedBounds, 'buttonFavorite')}
            onClick={addVideoToFavoriteHandler}
        >
            <FavoriteBorder classes={g(classedBounds, 'favoriteBorderIcon')}/>
            {ig(i18nButtons, 'addToFavorite')}
        </Button>,

    renderIframe = (src, currentWidth, isVideo) => isVideo === 'isVideo'
        ? <VideoIframe
            title={src}
            src={src}
            frameBorder="0"
        />
        : process.env.NODE_ENV === 'production'
        ? <AdIframeWrapper currentWidth={currentWidth}>
            <AdIframe
                title={src}
                src={`https://videosection.com/_ad#str-eng-1545--${src}`}
                currentWidth={currentWidth}
                frameBorder="0"
            />
        </AdIframeWrapper>
        : <AdGag currentWidth={currentWidth}/>,

    renderTag = (classedBounds, cb, x, getTagLink) => <StyledLink to={getTagLink(x)} key={x}>
        <Chip
            label={x}
            classes={g(classedBounds, 'chip')}
            component="div"
            variant="outlined"
            color={ccb(cb, sm) === -1 ? 'primary' : 'secondary'}
            clickable
        />
    </StyledLink>,

    renderProvidedBy = (
        classedBounds,
        i18nLabelProvidedBy,
        sponsorLinkBuilder,
        sponsorName,
        withLabel = false,
    ) => <Typography variant="body1" classes={g(classedBounds, 'typographySponsor')}>
        { ! withLabel ? null : `${i18nLabelProvidedBy}: `}
        <SponsorLink to={sponsorLinkBuilder(sponsorName.toLowerCase())}>
            {sponsorName}
        </SponsorLink>
    </Typography>,

    VideoPage = props => <Fragment>
        <PageTextHelmet
            pageText={ig(props.data, 'pageText')}
            openGraphData={ig(props.data, 'openGraphData')}
        />
        <PageWrapper>
            <PlayerSection>
                <Typography
                    variant="h4"
                    gutterBottom
                    classes={g(props, 'classedBounds', 'typographyTitle')}
                >
                    {`${ig(props.data, 'gallery', 'title')} ${
                        ig(props.data, 'pageText', 'galleryTitle')}`}
                </Typography>
                {ccb(g(props, 'cb'), sm) === -1 ? null : renderProvidedBy(
                    g(props, 'classedBounds'),
                    g(props, 'i18nLabelProvidedBy'),
                    g(props, 'sponsorLinkBuilder'),
                    ig(props.data, 'gallery', 'sponsorName'),
                    true,
                )}
                <VideoPlayer ref={g(props, 'setPlayerRef')}>
                    <VideoWrapper>
                        <Video>
                            {(ig(props.data, 'inlineAdvertisementIsShowed') && !g(props, 'isSSR'))
                                ? <InlineAdvertisementWrapper>
                                    <InlineAdvertisement
                                        currentWidth={g(props, 'currentWidth')}
                                    >
                                        <CloseAdvertisement
                                            onClick={g(props, 'closeAdvertisementHandler')}
                                        />
                                        {renderIframe('invideo', g(props, 'currentWidth'))}
                                    </InlineAdvertisement>
                                </InlineAdvertisementWrapper>
                                : null}
                            {renderIframe(
                                ig(props.data, 'gallery', 'urlForIframe'),
                                null,
                                'isVideo'
                            )}
                        </Video>
                        <ControlPanel>
                            <ControlPanelBlock>
                                {g(props, 'isSSR') ? null : renderFavoriteButton(
                                    g(props, 'classedBounds'),
                                    g(props, 'data'),
                                    g(props, 'favoriteVideoList'),
                                    g(props, 'addVideoToFavoriteHandler'),
                                    g(props, 'removeVideoFromFavoriteHandler'),
                                    g(props, 'i18nButtons'),
                                )}
                                <StyledLink to="/">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        classes={g(props, 'classedBounds', 'buttonRoot')}
                                    >
                                        <HomeIcon classes={g(props, 'classedBounds', 'homeIcon')}/>
                                        {ig(props.i18nButtons, 'backToMainPage')}
                                    </Button>
                                </StyledLink>
                                { ccb(g(props, 'cb'), xs) === 1 ? null : renderProvidedBy(
                                    g(props, 'classedBounds'),
                                    g(props, 'i18nLabelProvidedBy'),
                                    g(props, 'sponsorLinkBuilder'),
                                    ig(props.data, 'gallery', 'sponsorName'),
                                )}
                            </ControlPanelBlock>
                            <ControlPanelBlock>
                                {g(props, 'isSSR') ? null :
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        classes={g(props, 'classedBounds', 'buttonReport')}
                                        onClick={g(props, 'toggleReportDialogHandler')}
                                    >
                                        <ReportIcon
                                            classes={g(props, 'classedBounds', 'reportIcon')}
                                        />
                                        {ig(props.i18nButtons, 'report')}
                                    </Button>}
                            </ControlPanelBlock>
                        </ControlPanel>
                    </VideoWrapper>
                    <Advertisement>
                        {renderIframe('sidebar1', g(props, 'currentWidth'))}
                        {renderIframe('sidebar2', g(props, 'currentWidth'))}
                    </Advertisement>
                    <TagsWrapper>
                        { ! ig(props.data, 'gallery', 'tags') ? null :
                            ig(props.data, 'gallery', 'tags').map(x => renderTag(
                                g(props, 'classedBounds'),
                                g(props, 'cb'),
                                x,
                                g(props, 'getTagLink')
                            ))}
                    </TagsWrapper>
                </VideoPlayer>
            </PlayerSection>
            <RelatedVideos>
                <Typography
                    variant="h4"
                    gutterBottom
                    classes={g(props, 'classedBounds', 'typographyTitle')}
                >
                    {g(props, 'i18nRelatedVideo')}
                </Typography>
                <VideoList
                    videoList={ig(props.data, 'videoList')}
                />
            </RelatedVideos>
            <BottomAdvertisement>
                {renderIframe('bottom1', g(props, 'currentWidth'))}
                {renderIframe('bottom2', g(props, 'currentWidth'))}
                {ccb(g(props, 'cb'), md) === -1 ? null :
                    renderIframe('bottom3', g(props, 'currentWidth'))}
            </BottomAdvertisement>
        </PageWrapper>
    </Fragment>,

    setNewPageFlow = props => {
        if (ig(props.data, 'isLoaded')) {
            props.scrollToPlayer()
            props.setNewText(getHeaderText(g(props, 'data'), true, false))
        }
    },

    loadPageFlow = props => {
        const
            pageRequestParams = getPageRequestParams(g(props, 'routerContext'), g(props, 'match'))

        if (doesItHaveToBeReloaded(g(props, 'data'), pageRequestParams))
            props.loadPage(pageRequestParams)
    }

export default compose(
    orientationPortal,
    sectionPortal,
    connect(
        state => ({
            cb: ig(state, 'app', 'ui', 'currentBreakpoint'),
            isSSR: ig(state, 'app', 'ssr', 'isSSR'),
            data: ig(state, 'app', 'videoPage'),
            routerContext: getRouterContext(state),
            favoriteVideoList: ig(state, 'app', 'ui', 'favoriteVideoList'),
            currentWidth: ig(state, 'app', 'ui', 'currentWidth'),
            i18nButtons: ig(state, 'app', 'locale', 'i18n', 'buttons'),
            i18nRelatedVideo: ig(state, 'app', 'locale', 'i18n', 'headers', 'relatedVideo'),
            i18nLabelProvidedBy: ig(state, 'app', 'locale', 'i18n', 'labels', 'providedBy'),
        }),
        {
            loadPageRequest: g(actions, 'loadPageRequest'),
            setNewText: g(headerActions, 'setNewText'),
            closeAdvertisement: g(actions, 'closeAdvertisement'),
            addVideoToFavorite: g(appActions, 'addVideoToFavorite'),
            removeVideoFromFavorite: g(appActions, 'removeVideoFromFavorite'),
            toggleReportDialog: g(reportDialogActions, 'toggleReportDialog'),
        }
    ),
    withState('playerRef', 'setPlayerRef', null),
    withHandlers({
        loadPage: props => pageRequestParams => props.loadPageRequest({pageRequestParams}),
        closeAdvertisementHandler: props => () => props.closeAdvertisement(),
        addVideoToFavoriteHandler: props => event => {
            event.preventDefault()
            props.addVideoToFavorite(ig(props.data, 'gallery').deleteAll(
                ['published', 'classId', 'sponsorUrl', 'urlForIframe']
            ))
        },
        removeVideoFromFavoriteHandler: props => event => {
            event.preventDefault()
            props.removeVideoFromFavorite(ig(props.data, 'gallery', 'id'))
        },
        toggleReportDialogHandler: props => () => {
            props.toggleReportDialog()
        },
        getTagLink: props => searchQuery => routerGetters.findVideos.link(
            g(props, 'routerContext'),
            {searchQuery},
            ['searchQuery'],
        ),
        sponsorLinkBuilder: props => sponsor =>
            routerGetters.site.link(g(props, 'routerContext'), sponsor, null),
        scrollToPlayer: props => () => {
            animateScroll.scrollTo(g(props, 'playerRef', 'offsetTop'), {
                duration: 500,
                delay: 500,
                smooth: true,
            })
        }
    }),
    lifecycleForPageWithRefs(loadPageFlow, setNewPageFlow, ['playerRef']),
    withStyles(muiStyles),
    withPropsOnChange([], props => ({
        classedBounds: Object.freeze({
            typographyTitle: Object.freeze({root: g(props, 'classes', 'typographyTitle')}),
            typographySponsor: Object.freeze({root: g(props, 'classes', 'typographySponsor')}),
            buttonRoot: Object.freeze({root: g(props, 'classes', 'buttonRoot')}),
            buttonFavorite: Object.freeze({root: g(props, 'classes', 'buttonFavorite')}),
            buttonReport: Object.freeze({root: g(props, 'classes', 'buttonReport')}),
            favoriteBorderIcon: Object.freeze({root: g(props, 'classes', 'favoriteBorderIcon')}),
            favoriteIcon: Object.freeze({root: g(props, 'classes', 'favoriteIcon')}),
            reportIcon: Object.freeze({root: g(props, 'classes', 'reportIcon')}),
            homeIcon: Object.freeze({root: g(props, 'classes', 'homeIcon')}),
            chip: Object.freeze({root: g(props, 'classes', 'chip')}),
        }),
    })),
    setPropTypes(process.env.NODE_ENV === 'production' ? null : {
        classes: PropTypes.exact({
            typographyTitle: PropTypes.string,
            typographySponsor: PropTypes.string,
            buttonRoot: PropTypes.string,
            buttonFavorite: PropTypes.string,
            buttonReport: PropTypes.string,
            favoriteBorderIcon: PropTypes.string,
            favoriteIcon: PropTypes.string,
            reportIcon: PropTypes.string,
            homeIcon: PropTypes.string,
            chip: PropTypes.string,
        }),

        classedBounds: PropTypes.exact({
            typographyTitle: PropTypes.object,
            typographySponsor: PropTypes.object,
            buttonRoot: PropTypes.object,
            buttonFavorite: PropTypes.object,
            buttonReport: PropTypes.object,
            favoriteBorderIcon: PropTypes.object,
            favoriteIcon: PropTypes.object,
            reportIcon: PropTypes.object,
            homeIcon: PropTypes.object,
            chip: PropTypes.object,
        }),

        cb: PropTypes.oneOf(breakpoints),
        isSSR: PropTypes.bool,
        data: model,
        routerContext: routerContextModel,
        favoriteVideoList: ImmutablePropTypes.listOf(PropTypes.number),
        currentWidth: PropTypes.number,
        i18nButtons: immutableI18nButtonsModel,
        i18nRelatedVideo: PropTypes.string,
        i18nLabelProvidedBy: PropTypes.string,
        playerRef: PropTypes.nullable(PropTypes.instanceOf(
            typeof Element === 'undefined' ? () => {} : Element // plug for SSR
        )),

        loadPageRequest: PropTypes.func,
        loadPage: PropTypes.func,
        setNewText: PropTypes.func,
        closeAdvertisement: PropTypes.func,
        closeAdvertisementHandler: PropTypes.func,
        addVideoToFavorite: PropTypes.func,
        addVideoToFavoriteHandler: PropTypes.func,
        removeVideoFromFavorite: PropTypes.func,
        removeVideoFromFavoriteHandler: PropTypes.func,
        getTagLink: PropTypes.func,
        sponsorLinkBuilder: PropTypes.func,
        scrollToPlayer: PropTypes.func,
        toggleReportDialog: PropTypes.func,
        toggleReportDialogHandler: PropTypes.func,
    }),
    loadingWrapper({
        withPlayer: true,
        withMoviesList: true,
    })
)(VideoPage)
