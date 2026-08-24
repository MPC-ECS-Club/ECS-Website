//GitHub Pages serves our data and templates with Cache-Control: max-age=600, so
//by default the browser reuses them for ten minutes without asking the server -
//and that stored copy survives a reload, which is why edits appeared stale.
//
//`cache: "no-cache"` doesn't disable caching; it forces a conditional request on
//every page load. Unchanged files come back as a 304 with no body, so this stays
//cheap while guaranteeing fresh content. Within a single page load the parsed
//results are memoized below, so hash navigation doesn't refetch anything.

const dataCache = new Map();

//fetches url, always revalidating against the server, and throws on a bad status
async function fetchRevalidated(url) {
    const response = await fetch(url, { cache: "no-cache" });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
}

//memoizes for the life of the page; the promise is cached so that concurrent
//callers share one request, and failures are evicted so they can be retried
function fetchCached(url, read) {
    if (!dataCache.has(url)) {
        const pending = fetchRevalidated(url).then(read).catch(error => {
            dataCache.delete(url);
            throw error;
        });
        dataCache.set(url, pending);
    }
    return dataCache.get(url);
}

function fetchJSON(url) {
    return fetchCached(url, response => response.json());
}

function fetchText(url) {
    return fetchCached(url, response => response.text());
}
