export interface URLParts {
    hostname: string
    pathname: string
    domain: string
}

export type URLPartsExtractor = (url: string) => URLParts
