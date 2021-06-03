/* This module's contents was taken from the Memex project's `src/search/pipeline` module. */
import { parse as parseUrl } from 'url'

import normalizeUrl from '../normalize'
import { URLParts } from './types'

export class UrlParseError extends Error {

}

export default function extractUrlParts(url: string, options?: {
    supressParseError: boolean
}): URLParts {
    // NOTE: Before making suppressError configurable, it already suppressed errors, so
    // if we want to make false the default, we should find out what effects it has in
    // code relying on this behavios

    let normalized: string
    try {
        normalized = normalizeUrl(url, { skipProtocolTrim: true })
    } catch (error) {
        normalized = url
    }

    try {
        const parsed = parseUrl(normalized)
        if (parsed.href == null) {
            throw new UrlParseError('Cannot parse URL')
        }

        return {
            hostname: parsed.hostname!,
            pathname: parsed.pathname!,
            domain: extractRootDomain(parsed.hostname!),
        }
    } catch (error) {
        if (!options?.supressParseError ?? true) {
            throw error
        }

        console.error(`cannot parse URL: ${normalized}`)
        return {
            hostname: normalized,
            pathname: normalized,
            domain: normalized,
        }
    }
}

/**
 * Derived from answer in: https://stackoverflow.com/a/23945027
 */
export function extractRootDomain(hostname: string): string {
    const splitArr = hostname.split('.')
    const len = splitArr.length

    // Extracting the root domain here if there is a subdomain
    if (len > 2) {
        hostname = `${splitArr[len - 2]}.${splitArr[len - 1]}`

        // Check to see if it's using a ccTLD (i.e. ".me.uk")
        if (
            splitArr[len - 1].length === 2 &&
            [2, 3].includes(splitArr[len - 2].length)
        ) {
            hostname = `${splitArr[len - 3]}.${hostname}`
        }
    }

    return hostname
}
