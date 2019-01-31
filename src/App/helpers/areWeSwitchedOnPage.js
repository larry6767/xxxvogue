import g from './plain/provedGet'
import ig from './immutable/provedGet'
import PropTypes from './propTypes'
import ImmutablePropTypes from './propTypes/immutable'
import {assertPropTypes} from './propTypes/check'

const
    dataModelProps = process.env.NODE_ENV === 'production' ? null : Object.freeze({
        isLoaded: PropTypes.bool,
    }),

    propsModel = process.env.NODE_ENV === 'production' ? null : PropTypes.shape({
        currentSection: PropTypes.nullable(PropTypes.string),
        data: PropTypes.oneOfType([
            ImmutablePropTypes.recordOf(dataModelProps),
            ImmutablePropTypes.shape(dataModelProps),
        ])
    }),

    optionalPropsModel = process.env.NODE_ENV === 'production' ? null :
        PropTypes.nullable(propsModel)

export default (prevProps, nextProps) => {
    if (process.env.NODE_ENV !== 'production') {
        assertPropTypes(optionalPropsModel, prevProps, 'areWeSwitchedOnPage', 'prevProps')
        assertPropTypes(propsModel, nextProps, 'areWeSwitchedOnPage', 'nextProps')
    }

    if (
        // if we went to new section
        (
            prevProps !== null &&
            g(prevProps, 'currentSection') !== g(nextProps, 'currentSection')
        ) ||
        // if we still on the same section but new data is just loaded
        (prevProps === null && ig(g(nextProps, 'data'), 'isLoaded')) ||
        (
            prevProps !== null &&
            !ig(g(prevProps, 'data'), 'isLoaded') &&
            ig(g(nextProps, 'data'), 'isLoaded')
        )
    )
        return true
    else
        return false
}
