import React from 'react'
import {connect} from 'react-redux'
import {compose, lifecycle} from 'recompose'
import {withStyles} from '@material-ui/core'
import {
    CircularProgress,
    Typography,
    Button,
} from '@material-ui/core'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import Favorite from '@material-ui/icons/Favorite'
import {
    Record,
    Map,
    List,
} from 'immutable'
import ErrorContent from '../../generic/ErrorContent'
import VideoList from '../../generic/VideoList'
import {getSubPage} from '../helpers'
import {
    Page,
    Content,
    PageWrapper,
    VideoPlayer,
    Video,
    ControlPanel,
    Advertisement,
    RelatedVideos,
    BottomAdvertisement,
    InlineAdvertisementWrapper,
    InlineAdvertisement,
    CloseAdvertisement,
} from './assets'
import actions from './actions'
import appActions from '../actions'
import {muiStyles} from './assets/muiStyles'

const
    VideoPageRecord = Record({
        isLoading: false,
        isLoaded: false,
        isFailed: false,

        inlineAdvertisementIsShowed: true,
        lastSubPageForRequest: '',

        pageText: Map(),
        gallery: Map(),
        videoList: List(),
    }),

    FavoriteButton = ({
        classes, data, favoriteVideoList,
        addVideoToFavoriteHandler, removeVideoFromFavoriteHandler,
    }) => favoriteVideoList.find(id => id === data.getIn(['gallery', 'id']))
        ? <Button
            variant="contained"
            color="primary"
            classes={{
                root: classes.buttonRoot
            }}
            onClick={(event) => {
                event.preventDefault()
                removeVideoFromFavoriteHandler(data.getIn(['gallery', 'id']))
            }}
        >
            <Favorite
                classes={{root: classes.favoriteIcon}}
            />
            {'Remove from favorites'}
        </Button>
        : <Button
            variant="contained"
            color="primary"
            classes={{
                root: classes.buttonRoot
            }}
            onClick={(event) => {
                event.preventDefault()
                addVideoToFavoriteHandler(data.get('gallery'))
            }}
        >
            <FavoriteBorder
                classes={{root: classes.favoriteBorderIcon}}
            />
            {'Add to favorites'}
        </Button>,

    VideoPage = ({
        classes, data, favoriteVideoList, closeAdvertisementHandler,
        addVideoToFavoriteHandler, removeVideoFromFavoriteHandler
    }) => <Page>
        { data.get('isFailed')
            ? <ErrorContent/>
            : data.get('isLoading')
            ? <CircularProgress/>
            : <Content>
                <PageWrapper>
                    <section>
                        <Typography
                            variant="h4"
                            gutterBottom
                            classes={{
                                root: classes.typographyTitle
                            }}
                        >
                            {`${data.getIn(['gallery', 'title'])} ${
                                data.getIn(['pageText', 'galleryTitle'])}`}
                        </Typography>
                        <VideoPlayer>
                            <Video>
                                {data.get('inlineAdvertisementIsShowed')
                                    ? <InlineAdvertisementWrapper>
                                        <InlineAdvertisement>
                                            <CloseAdvertisement
                                                onClick={closeAdvertisementHandler}
                                            />
                                            <iframe
                                                src="https://videosection.com/_ad#str-eng-1545--invideo"
                                                frameBorder="0"
                                            ></iframe>
                                        </InlineAdvertisement>
                                    </InlineAdvertisementWrapper>
                                    : null}
                                <iframe
                                    src={data.getIn(['gallery', 'urlForIframe'])}
                                    frameBorder="0"
                                />
                                <ControlPanel>
                                    <FavoriteButton
                                        data={data}
                                        classes={classes}
                                        favoriteVideoList={favoriteVideoList}
                                        addVideoToFavoriteHandler={addVideoToFavoriteHandler}
                                        removeVideoFromFavoriteHandler={removeVideoFromFavoriteHandler}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        classes={{
                                            root: classes.buttonRoot
                                        }}
                                    >
                                        {'Back to main page'}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        classes={{
                                            root: classes.buttonRoot
                                        }}
                                    >
                                        {'Report'}
                                    </Button>
                                </ControlPanel>
                            </Video>
                            <Advertisement>
                                <iframe
                                    src="https://videosection.com/_ad#str-eng-1545--sidebar1"
                                    frameBorder="0"
                                ></iframe>
                                <iframe
                                    src="https://videosection.com/_ad#str-eng-1545--sidebar2"
                                    frameBorder="0"
                                ></iframe>
                            </Advertisement>
                        </VideoPlayer>
                    </section>
                    <RelatedVideos>
                        <Typography
                            variant="h4"
                            gutterBottom
                            classes={{
                                root: classes.typographyTitle
                            }}
                        >
                            {'Click On Each Of These Related Films'}
                        </Typography>
                        <VideoList
                            videoList={data.get('videoList')}
                        />
                    </RelatedVideos>
                    <BottomAdvertisement>
                        <iframe
                            src="https://videosection.com/_ad#str-eng-1545--bottom1"
                            frameBorder="0"
                        ></iframe>
                        <iframe
                            src="https://videosection.com/_ad#str-eng-1545--bottom2"
                            frameBorder="0"
                        ></iframe>
                        <iframe
                            src="https://videosection.com/_ad#str-eng-1545--bottom3"
                            frameBorder="0"
                        ></iframe>
                    </BottomAdvertisement>
                </PageWrapper>
            </Content>
        }
    </Page>,

    loadPageFlow = ({match, data, loadPage}) => {
        const
            subPageForRequest = getSubPage(`${match.params.child}/${match.params.name}`)

        if (typeof subPageForRequest !== 'string')
            throw new Error(
                `Something went wront, unexpected "subPageForRequest" type: "${
                    typeof subPageForRequest}"` +
                ' (this is supposed to be provided by router via props to the component)'
            )

        // "unless" condition.
        // when data is already loaded for a specified `subPage` or failed (for that `subPage`).
        if (!(
            data.get('isLoading') ||
            (
                (data.get('isLoaded') || data.get('isFailed')) &&
                subPageForRequest === data.get('lastSubPageForRequest')
            )
        ))
            loadPage(subPageForRequest)
    }

export default compose(
    connect(
        state => ({
            data: VideoPageRecord(state.getIn(['app', 'videoPage'])),
            isSSR: state.getIn(['app', 'ssr', 'isSSR']),
            pageUrl: state.getIn(['router', 'location', 'pathname']),
            favoriteVideoList: state.getIn(['app', 'ui', 'favoriteVideoList']),
        }),
        dispatch => ({
            loadPage: subPageForRequest => dispatch(actions.loadPageRequest(subPageForRequest)),
            closeAdvertisementHandler: () => dispatch(actions.closeAdvertisement()),
            addVideoToFavoriteHandler: video => dispatch(appActions.addVideoToFavorite(video)),
            removeVideoFromFavoriteHandler: id => dispatch(appActions.removeVideoFromFavorite(id)),
        })
    ),
    lifecycle({
        componentDidMount() {
            loadPageFlow(this.props)
        },

        componentWillReceiveProps(nextProps) {
            loadPageFlow(nextProps)
        },
    }),
    withStyles(muiStyles)
)(VideoPage)
