import { parse as parseUrl, UrlWithParsedQuery } from 'url'
import { normalizeUrl } from './utils'

import { defaultNormalizationOpts } from './defaults'
import { NormalizationOptions } from './types'
import queryParamRules from './query-string-normalization-rules'

export { isFullUrl } from './utils'
export const PROTOCOL_PATTERN = /^\w+:\/\//

function reconstructParsedUrl({
    protocol,
    hostname,
    pathname,
    query,
}: UrlWithParsedQuery) {
    const qs = Object.entries(query).reduce((qs, [query, value], i) => {
        const connector = i === 0 ? '?' : '&'
        return (qs += `${connector}${query}=${value}`)
    }, '')

    return `${protocol}//${hostname}${pathname}${qs}`
}

/**
 * Applies our custom query-param normalization rules for specific sites, removing all
 * but specific params from the query string.
 */
function applyQueryParamsRules(url: string): string {
    const parsedUrl = parseUrl(url, true)
    const rulesObj = queryParamRules.get(parsedUrl.hostname!)

    // Base case; domain doesn't have any special normalization rules
    if (!rulesObj) {
        return url
    }

    // Remove all query params that don't appear in special rules
    const rulesSet = new Set(rulesObj.rules)
    const rulesType = rulesObj.type
    for (const param of [...Object.keys(parsedUrl.query)]) {
        const shouldDelete =
            rulesType === 'keep' ? !rulesSet.has(param) : rulesSet.has(param)

        if (shouldDelete) {
            delete parsedUrl.query[param]
        }
    }

    return reconstructParsedUrl(parsedUrl)
}

export default function normalize(
    url: string,
    customOpts: NormalizationOptions = {},
): string {
    let normalized

    try {
        normalized = normalizeUrl(url, {
            ...defaultNormalizationOpts,
            ...customOpts,
        } as any)
    } catch (err) {
        if (!(customOpts?.suppressParseError ?? true)) {
            throw err
        }
        normalized = url
    }

    if (!customOpts.skipQueryRules) {
        normalized = applyQueryParamsRules(normalized)
    }

    // Remove the protocol; we don't need/want it for IDs
    return !customOpts.skipProtocolTrim
        ? normalized.replace(PROTOCOL_PATTERN, '')
        : normalized
}
