import {PropTypes} from 'src/App/helpers/propTypes'
import {assertPropTypes} from 'src/App/helpers/propTypes/check'

// WARNING! Be careful! Avoid recursive dependencies!
import {orientationCodes} from 'src/App/models'

const
    classIdModel = process.env.NODE_ENV === 'production' ? null :
        PropTypes.oneOf([1, 2, 3]),
    orientationModel = process.env.NODE_ENV === 'production' ? null :
        PropTypes.oneOf(orientationCodes)

export default classId => {
    if (process.env.NODE_ENV !== 'production')
        assertPropTypes(
            classIdModel,
            classId,
            'getOrientationByClassId',
            'classId'
        )
    const
        orientation = orientationCodes[classId - 1]

    if (process.env.NODE_ENV !== 'production')
        assertPropTypes(
            orientationModel,
            orientation,
            'getOrientationByClassId',
            'orientation'
        )

    return orientation
}
