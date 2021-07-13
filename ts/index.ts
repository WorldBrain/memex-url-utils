import normalizeUrl from './normalize'

export { normalizeUrl }
export { isFullUrl } from './normalize'
export { default as extractUrlParts } from './extract-parts'

export * from './normalize/types'
export * from './extract-parts/types'

/**
 * Derived from answer in: https://stackoverflow.com/a/23945027
 */
function extractRootDomain(hostname: string) {
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

/**
 * @param url A raw URL string to attempt to extract parts from.
 * @returns Object containing `hostname` and `pathname` props. Values should be the `domain.tld.cctld` part and
 *  everything after, respectively. If regex matching failed on given URL, error will be logged and simply
 *  the URL with protocol and opt. `www` parts removed will be returned for both values.
 */
export function transformUrl(
    url: string,
): {
    hostname: string
    pathname: string
    domain: string
} {
    let normalized: string

    try {
        normalized = normalizeUrl(url, { skipProtocolTrim: true })
    } catch (error) {
        normalized = url
    }

    try {
        const parsed = new URL(normalized)

        return {
            hostname: parsed.hostname,
            pathname: parsed.pathname,
            domain: extractRootDomain(parsed.hostname),
        }
    } catch (error) {
        console.error(`cannot parse URL: ${normalized}`)
        return {
            hostname: normalized,
            pathname: normalized,
            domain: normalized,
        }
    }
}
