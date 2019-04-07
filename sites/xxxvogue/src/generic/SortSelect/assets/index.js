import styled from 'styled-components'

export const SortWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    ${({theme}) => theme.media.mobile`margin-bottom: 8px;`};

    html.is-loading & * {
        display: none;
    }

    html.is-loading & {
        background: ${({theme}) => theme.palette.prerender.plug};
        border-radius: 4px;
        width: 145.5px;
        height: 37px;
    }
`
export const InlinedSelectionWrap = styled.div`
    display: block;
    margin: 10px 0;
`

export const InlinedSelectionList = styled.nav`
    display: flex;
    width: 100%;
    justify-content: center;
`

export const InlinedSelectionItem = styled.a`
    display: inline-block;
    padding: 10px 10px;
    border: 2px solid
        ${({theme, isActive}) => isActive ? theme.palette.primary.main : theme.palette.primary.dark};
    color:
        ${({theme, isActive}) =>
            isActive ? theme.palette.primary.main : theme.palette.primary.light};
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    vertical-align: middle;
    line-height: 24px;

    &>* {
        vertical-align: middle;
        margin-bottom: 0;
    }

    &:first-child {
        border-radius: 4px 0 0 4px;
        border-right: none;
    }

    &:last-child {
        border-radius: 0 4px 4px 0;
        border-left: none;
    }
`