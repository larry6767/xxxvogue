import React from 'react'
import styled from 'styled-components'
import {ImageRandomWidth} from 'src/generic/assets'
import {Link} from 'react-router-dom'

export const StyledLink = styled(Link)`
    color: ${({theme}) => theme.palette.primary.dark};
    margin-right: 4px;

    &:not(:last-child)::after {
        content: ',';
    }
`

export const StyledLinkBlock = styled(Link)`
    text-decoration: none;
`

export const ProviderLink = styled(({isInline, ...rest}) => <Link {...rest}/>)`
    ${({theme, isInline}) =>
        `color: ${isInline ? theme.palette.primary.contrastText : theme.palette.primary.dark}`}
    white-space: nowrap;
`

export const NativeLink = styled.a`
    text-decoration: none;
`

export const Wrapper = styled(ImageRandomWidth)`

`

export const VideoPreviewBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 31px;
    transform: translateY(35px);
    transition: transform 0.2s;

    ${({theme}) => theme.media.sm`transform: translateY(0);`}
    ${({theme}) => theme.media.mobile`transform: translateY(0);`}
`

const VideoPreviewCommon = styled.div`
    width: 100%;
    height: 200px;
    margin-bottom: 5px;

    ${({theme}) => theme.media.xs`height: 140px;`}
    ${({theme}) => theme.media.xxs`height: 200px;`}
`

export const VideoPreview = styled(VideoPreviewCommon)`
    position: relative;
    display: flex;
    align-items: flex-end;
    background-color: ${({theme}) => theme.palette.prerender.plug};
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 1px;
    overflow: hidden;
    z-index: 0;

    &:hover ${VideoPreviewBar} {
        transform: translateY(0px);
    }

    &::after {
        display: ${({hasOnlyOneThumb}) => hasOnlyOneThumb ? 'none' : 'block'};
        content: '';
        opacity: 0;
        position: absolute;
        height: 2px;
        top: 0;
        right: 0;
        left: 0;
        background-color: ${({theme}) => theme.palette.primary.light};
        transform: translateX(-100%);
        transition: transform 1s;
        z-index: 1;
    }

    &:hover::after {
        transform: translateX(0);
        opacity: 1;
    }
`

export const InfoBlock = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 0 3px;
`

export const InfoBlockInner = styled.div`
    display: flex;
    justify-content: space-between;
`

export const TagsBlock = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 1.5;

    ${({theme}) => theme.media.md`font-size: 10px;`}
    ${({theme}) => theme.media.sm`font-size: 10px;`}
    ${({theme}) => theme.media.mobile`font-size: 10px;`}
`

export const Like = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({theme}) => theme.palette.primary.lightOpacity};
    border-radius: 1px;
    min-height: 35px;
    min-width: 40px;
    cursor: pointer;
`

export const Duration = styled.div`
    display: flex;
    align-items: center;
    padding: 0 5px;
    background-color: ${({theme}) => theme.palette.primary.lightOpacity};
    border-radius: 1px;
    min-height: 35px;
`

// styles for plug

export const VideoPreviewPlug = styled(VideoPreviewCommon)`
    background: ${({theme}) => theme.palette.prerender.plug};
`

export const TitlePlug = styled.div`
    width: 100%;
    height: 20px;
    margin: 2px 0;
    background: ${({theme}) => theme.palette.prerender.plug};

    ${({theme}) => theme.media.mobile`height: 18px;`};
`

export const ProviderLinkPlug = styled.div`
    width: 40%;
    height: 21px;
    background: ${({theme}) => theme.palette.prerender.plug};

    ${({theme}) => theme.media.mobile`height: 18px;`};
`

export const TagsPlug = styled.div`
    width: 40%;
    height: 21px;
    background: ${({theme}) => theme.palette.prerender.plug};

    ${({theme}) => theme.media.mobile`height: 18px;`};
`
