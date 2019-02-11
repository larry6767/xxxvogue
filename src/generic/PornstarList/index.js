import React from 'react'
import {connect} from 'react-redux'
import {compose, withHandlers} from 'recompose'
import {withStyles} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'
import {Typography} from '@material-ui/core'

import {
    plainProvedGet as g,
    immutableProvedGet as ig,
    PropTypes,
    ImmutablePropTypes,
    setPropTypes,
} from '../../App/helpers'

import {immutableI18nButtonsModel} from '../../App/models'
import actions from '../../App/actions'
import {muiStyles} from './assets/muiStyles'
import {List, PornstarItem, Thumb, InfoBar, Like} from './assets'

const
    PornstarList = ({
        classes,
        i18nButtons,
        pornstarList,
        favoritePornstarList,
        addToFavoriteHandler,
        removeFromFavoriteHandler,
        linkBuilder,
    }) => <List>
        {pornstarList.map(x =>
            <PornstarItem key={ig(x, 'id')}>
                <Link
                    to={linkBuilder(ig(x, 'subPage'))}
                    className={g(classes, 'routerLink')}
                >
                    <Thumb thumb={ig(x, 'thumb')} />
                    <Typography
                        variant="body2"
                        classes={{root: g(classes, 'typographyTitle')}}
                    >
                        {ig(x, 'name')}
                    </Typography>
                    <InfoBar>
                        <Like>
                            {favoritePornstarList.find(id => id === ig(x, 'id'))
                                ? <Favorite
                                    classes={{root: g(classes, 'favoriteIcon')}}
                                    data-favorite-pornstar-id={ig(x, 'id')}
                                    onClick={removeFromFavoriteHandler}
                                />
                                : <FavoriteBorder
                                    classes={{root: g(classes, 'favoriteBorderIcon')}}
                                    data-favorite-pornstar-id={ig(x, 'id')}
                                    onClick={addToFavoriteHandler}
                                />
                            }
                        </Like>
                        <Typography
                            variant="body2"
                            classes={{root: g(classes, 'typographyQuantity')}}
                        >
                            {`${ig(x, 'itemsCount')} ${ig(i18nButtons, 'favoriteMovies')}`}
                            {/* TODO need localize */}
                        </Typography>
                    </InfoBar>
                </Link>
            </PornstarItem>
        )}
    </List>

export default compose(
    connect(
        state => ({
            favoritePornstarList: ig(state, 'app', 'ui', 'favoritePornstarList'),
            i18nButtons: ig(state, 'app', 'locale', 'i18n', 'buttons'),
        }),
        {
            addPornstarToFavorite: g(actions, 'addPornstarToFavorite'),
            removePornstarFromFavorite: g(actions, 'removePornstarFromFavorite'),
        }
    ),
    withHandlers({
        addToFavoriteHandler: props => event => {
            event.preventDefault()

            const
                id = Number(g(event.currentTarget.getAttribute('data-favorite-pornstar-id'), [])),
                x = props.pornstarList.find(x => ig(x, 'id') === id)

            props.addPornstarToFavorite(x)
        },

        removeFromFavoriteHandler: props => event => {
            event.preventDefault()

            const
                id = Number(g(event.currentTarget.getAttribute('data-favorite-pornstar-id'), [])),
                x = props.pornstarList.find(x => ig(x, 'id') === id)

            props.removePornstarFromFavorite(ig(x, 'id'))
        },
    }),
    withStyles(muiStyles),
    setPropTypes(process.env.NODE_ENV === 'production' ? null : {
        classes: PropTypes.shape({
            routerLink: PropTypes.string,
            typographyTitle: PropTypes.string,
            typographyQuantity: PropTypes.string,
            favoriteIcon: PropTypes.string,
        }),

        i18nButtons: immutableI18nButtonsModel,
        linkBuilder: PropTypes.func,
        addPornstarToFavorite: PropTypes.func,
        removePornstarFromFavorite: PropTypes.func,
        addToFavoriteHandler: PropTypes.func,
        removeFromFavoriteHandler: PropTypes.func,

        favoritePornstarList: ImmutablePropTypes.listOf(PropTypes.number),

        pornstarList: ImmutablePropTypes.listOf(ImmutablePropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            subPage: PropTypes.string,
            thumb: PropTypes.string,
            itemsCount: PropTypes.number,
        })),
    }),
)(PornstarList)
