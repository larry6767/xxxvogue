import {createActions} from 'src/App/helpers'

const actions = createActions('APP', [
    'RESIZE',

    'GET_FAVORITE_VIDEO_LIST',
    'SET_FAVORITE_VIDEO_LIST',
    'ADD_VIDEO_TO_FAVORITE',
    'REMOVE_VIDEO_FROM_FAVORITE',
    'ADD_VIDEO_ID_TO_FAVORITE',
    'REMOVE_VIDEO_ID_FROM_FAVORITE',

    'GET_FAVORITE_PORNSTAR_LIST',
    'SET_FAVORITE_PORNSTAR_LIST',
    'ADD_PORNSTAR_TO_FAVORITE',
    'REMOVE_PORNSTAR_FROM_FAVORITE',
    'ADD_PORNSTAR_ID_TO_FAVORITE',
    'REMOVE_PORNSTAR_ID_FROM_FAVORITE',

    'SET_LOCALE_CODE',
    'FILL_LOCALE_ROUTER',
    'FILL_LOCALE_I18N',
])

export default actions
