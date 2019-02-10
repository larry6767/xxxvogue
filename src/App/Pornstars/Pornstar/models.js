import {Record} from 'immutable'
import {ImmutablePropTypes, PropTypes} from '../../helpers'

import {
    immutablePageTextModel,
    immutableModelsListWithLetterModel,
    pageRequestParamsModel,
} from '../../models'

import {immutableVideoItemModel} from '../../../generic/VideoItem/models'

const
    pornstarInfoForTableModelBuilder = process.env.NODE_ENV === 'production' ? null :
        (isImmutable) => {
            const
                exact = isImmutable ? ImmutablePropTypes.exact : PropTypes.exact,

                props = {
                    name: PropTypes.string.isOptional,
                    alias: PropTypes.string.isOptional,
                    astrologicalSign: PropTypes.string.isOptional,
                    bodyHair: PropTypes.string.isOptional,
                    boobsFake: PropTypes.string.isOptional,
                    breast: PropTypes.number.isOptional,
                    breastSizeType: PropTypes.string.isOptional,
                    city: PropTypes.string.isOptional,
                    colorEye: PropTypes.string.isOptional,
                    colorHair: PropTypes.string.isOptional,
                    country: PropTypes.string.isOptional,
                    cupSize: PropTypes.string.isOptional,
                    ethnicity: PropTypes.string.isOptional,
                    extra: PropTypes.string.isOptional,
                    height: PropTypes.number.isOptional,
                    hip: PropTypes.number.isOptional,
                    physiqueCustom: PropTypes.string.isOptional,
                    piercings: PropTypes.string.isOptional,
                    profession: PropTypes.string.isOptional,
                    sexualRole: PropTypes.string.isOptional,
                    shoeSize: PropTypes.number.isOptional,
                    tatoos: PropTypes.string.isOptional,
                    waist: PropTypes.number.isOptional,
                    weight: PropTypes.number.isOptional,

                    birthday: PropTypes.string.isOptional,
                    lifetime: PropTypes.string.isOptional,
                    careerTime: PropTypes.string.isOptional,
                    penis: PropTypes.string.isOptional,
                }

            return exact(props)
        },

    pornstarInfoModelBuilder = process.env.NODE_ENV === 'production' ? null :
        (isImmutable) => {
            const
                exact = isImmutable ? ImmutablePropTypes.exactRecordOf : PropTypes.exact,

                props = {
                    id: PropTypes.number,
                    // idTag: PropTypes.number,
                    // thumbPath: PropTypes.string,
                    thumbUrl: PropTypes.string,
                    // urlGalleries: PropTypes.string,
                }

            return exact(props)
        }

export const
    pornstarInfoForTableModel = process.env.NODE_ENV === 'production' ? null :
        pornstarInfoForTableModelBuilder(false),

    pornstarInfoModel = process.env.NODE_ENV === 'production' ? null :
        pornstarInfoModelBuilder(false),

    PornstarInfoRecord = Record({
        id: 0,
        thumbUrl: '',
    })

const
    immutablePornstarInfoForTableModel = process.env.NODE_ENV === 'production' ? null :
        pornstarInfoForTableModelBuilder(true),

    immutablePornstarInfoModel = process.env.NODE_ENV === 'production' ? null :
        pornstarInfoModelBuilder(true),

    model = process.env.NODE_ENV === 'production' ? null : {
        isLoading: PropTypes.bool,
        isLoaded: PropTypes.bool,
        isFailed: PropTypes.bool,
        modelInfoIsOpen: PropTypes.bool,
        lastPageRequestParams: PropTypes.nullable(pageRequestParamsModel),
        pageNumber: PropTypes.number,
        pageText: immutablePageTextModel,
        pagesCount: PropTypes.number,
        sortList: ImmutablePropTypes.listOf(ImmutablePropTypes.exact({
            isActive: PropTypes.bool,
            code: PropTypes.string,
        })),
        currentSort: PropTypes.nullable(PropTypes.string),
        itemsCount: PropTypes.number,
        videoList: ImmutablePropTypes.listOf(immutableVideoItemModel),
        modelsList: immutableModelsListWithLetterModel,
        pornstarInfoForTable: immutablePornstarInfoForTableModel,
        pornstarInfo: immutablePornstarInfoModel,
    },

    stateModel = process.env.NODE_ENV === 'production' ? null :
        ImmutablePropTypes.exact(model),

    dataModel = process.env.NODE_ENV === 'production' ? null :
        ImmutablePropTypes.exactRecordOf(model)

export {
    immutablePornstarInfoForTableModel,
    immutablePornstarInfoModel,
    stateModel,
    dataModel,
}
