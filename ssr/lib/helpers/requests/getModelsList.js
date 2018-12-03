import {
    map,
    concat,
    sortBy,
    reduce,
} from 'lodash'

export default (letters, items) => reduce(
    letters,
    (acc, letter) => {
        const letterItems = sortBy(
            map(letter, ({id, name, sub_url, items_count}) => ({
                id,
                name,
                subPage: sub_url,
                itemsCount: items_count,
                thumb: items[id].thumb_url,
            })),
            o => o.name
        )

        acc = concat(acc, letterItems)
        return acc
    }, []
)
