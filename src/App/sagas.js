import mainHeaderSaga from './MainHeader/sagas'
import allMoviesSaga from './AllMovies/sagas'
import allNichesSaga from './AllNiches/sagas'
import pornstarsSaga from './Pornstars/sagas'

export default function* saga() {
    yield [
        mainHeaderSaga(),
        allNichesSaga(),
        allMoviesSaga(),
        pornstarsSaga(),
    ]
}
