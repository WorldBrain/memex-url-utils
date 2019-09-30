import extractUrlParts from '.'

const urlA = 'http://www.test.com/test/path'
const urlB = 'http://test.com/test/path'
const urlC = 'https://www.test.com/test/path'
const urlD = 'https://test.com/test/path'

const urlE = 'https://test.com'
const urlF = 'https://sub.test.com'
const urlG = 'https://sub.test.com/yet/another/path/'

describe('URL parts extraction tests', () => {
    // NOTE: "same URL" in terms of our normalization rules
    it('should be able to extract hostname, domain, pathname from different variations of the same URL', () => {
        for (const url of [urlA, urlB, urlC, urlD]) {
            const parts = extractUrlParts(url)
            expect(parts.domain).toEqual('test.com')
            expect(parts.hostname).toEqual('test.com')
            expect(parts.pathname).toEqual('/test/path')
        }
    })

    it('should be able to extract hostname, domain from a URL with no path', () => {
        const parts = extractUrlParts(urlE)
        expect(parts.domain).toEqual('test.com')
        expect(parts.hostname).toEqual('test.com')
        expect(parts.pathname).toEqual('/')
    })

    it('should be able to differentiate hostname and domain from a URL on a subdomain', () => {
        const partsA = extractUrlParts(urlF)
        expect(partsA.domain).toEqual('test.com')
        expect(partsA.hostname).toEqual('sub.test.com')
        expect(partsA.pathname).toEqual('/')

        const partsB = extractUrlParts(urlG)
        expect(partsB.domain).toEqual('test.com')
        expect(partsB.hostname).toEqual('sub.test.com')
        expect(partsB.pathname).toEqual('/yet/another/path')
    })
})
