import {ImmutablePropTypes, PropTypes} from 'src/App/helpers'
import {immutablePageTextModel, pageRequestParamsModel} from 'src/App/models'
import {immutableVideoItemModel} from 'src/generic/VideoItem/models'

export const
    model = process.env.NODE_ENV === 'production' ? null : ImmutablePropTypes.exact({
        isLoading: PropTypes.bool,
        isLoaded: PropTypes.bool,
        isFailed: PropTypes.bool,
        lastPageRequestParams: PropTypes.nullable(pageRequestParamsModel),
        pageText: PropTypes.nullable(immutablePageTextModel),
        pageNumber: PropTypes.number,
        pagesCount: PropTypes.number,
        itemsCount: PropTypes.number,
        videoList: ImmutablePropTypes.listOf(immutableVideoItemModel),
        randomWidthList: PropTypes.nullable(ImmutablePropTypes.listOf(PropTypes.number)),
    })
