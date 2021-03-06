import {ImmutablePropTypes, PropTypes} from 'src/App/helpers'

export const model = process.env.NODE_ENV === 'production' ? null : ImmutablePropTypes.exact({
    isSearchShown: PropTypes.bool,
    title: PropTypes.nullable(PropTypes.string),
    description: PropTypes.string,
})
