import React from 'react'

import {
    Wrapper,
    InfoBlock,
    InfoBlockInner,
    VideoPreviewPlug,
    TitlePlug,
    ProviderLinkPlug,
    TagsPlug,
} from 'src/generic/VideoItem/assets'

const
    VideoItemPlug = () => <Wrapper>
        <VideoPreviewPlug/>
        <InfoBlock>
            <TitlePlug/>
            <InfoBlockInner>
                <ProviderLinkPlug/>
                <TagsPlug/>
            </InfoBlockInner>
        </InfoBlock>
    </Wrapper>

export default VideoItemPlug
