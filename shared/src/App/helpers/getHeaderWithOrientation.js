import ig from 'src/App/helpers/immutable/provedGet'

export default (state, key) => ig(state, 'app', 'locale', 'i18n', 'headers', key).replace(
    '%ORIENTATION%',
    ig(
        ig(state, 'app', 'locale', 'i18n', 'orientation'),
        ig(state, 'app', 'mainHeader', 'niche', 'currentOrientation')
    )
)
