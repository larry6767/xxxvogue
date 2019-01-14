import {PropTypes, ImmutablePropTypes} from './helpers'

const
    localeRouterModelBuilder = isImmutable => {
        const
            exact = isImmutable ? ImmutablePropTypes.exact : PropTypes.exact

        return exact({
            routes: exact({
                archive: exact({label: PropTypes.string}),
                allNiches: exact({section: PropTypes.string}),
                niche: exact({section: PropTypes.string}),
                allMovies: exact({section: PropTypes.string}),
                pornstars: exact({section: PropTypes.string}),
                pornstar: exact({section: PropTypes.string}),
                favorite: exact({section: PropTypes.string}),
                favoritePornstars: exact({section: PropTypes.string}),
                video: exact({sectionPfx: PropTypes.string}),
            }),
            redirects: exact({
                categories: exact({search: PropTypes.string}),
                allMovies: exact({from: PropTypes.string}),
                pornstars: exact({from: PropTypes.string}),
                favorite: exact({
                    from: PropTypes.string,
                    fromMovies: PropTypes.string,
                }),
                favoritePornstars: exact({from: PropTypes.string}),
                video: exact({
                    fromPfx: PropTypes.string,
                    fromExt: PropTypes.string,
                }),
            }),
        })
    },

    i18nNavigationModelBuilder = isImmutable => {
        const
            exact = isImmutable ? ImmutablePropTypes.exact : PropTypes.exact,
            navigationItem = exact({title: PropTypes.string})

        return exact({
            home: navigationItem,
            allNiches: navigationItem,
            allMovies: navigationItem,
            pornstars: navigationItem,
            favorite: navigationItem,
        })
    },

    i18nAllNichesModelBuilder = isImmutable => {
        const
            exact = isImmutable ? ImmutablePropTypes.exact : PropTypes.exact

        return exact({
            pageHeader: PropTypes.string,
        })
    },

    i18nNavigationModel = i18nNavigationModelBuilder(false),
    immutableI18nNavigationModel = i18nNavigationModelBuilder(true),

    i18nAllNichesModel = i18nAllNichesModelBuilder(false),
    immutableI18nAllNichesModel = i18nAllNichesModelBuilder(true),

    i18nModelBuilder = isImmutable => {
        const
            exact = isImmutable ? ImmutablePropTypes.exact : PropTypes.exact

        return exact({
            navigation: isImmutable ? immutableI18nNavigationModel : i18nNavigationModel,
            allNiches: isImmutable ? immutableI18nAllNichesModel : i18nAllNichesModel,
        })
    }

export {
    i18nNavigationModel, immutableI18nNavigationModel,
    i18nAllNichesModel, immutableI18nAllNichesModel,
}

export const
    localeRouterModel = localeRouterModelBuilder(false),
    immutableLocaleRouterModel = localeRouterModelBuilder(true),

    i18nModel = i18nModelBuilder(false),
    immutableI18nModel = i18nModelBuilder(true),

    routerLocationModel = ImmutablePropTypes.exact({
        hash: PropTypes.string,
        pathname: PropTypes.string,
        search: PropTypes.string,
        state: ImmutablePropTypes.shape({}).isOptional,
        key: PropTypes.string.isOptional,
    })
