import axios from 'axios';
import * as cheerio from 'cheerio';

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept':
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
  'Cache-Control': 'no-cache'
};

/**
 * Validates whether an input string is a valid web URL
 * @param {string} urlString
 * @returns {boolean}
 */
export const isValidUrl = (urlString) => {
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

/**
 * Cleans extracted text by stripping excessive whitespace and line breaks
 * @param {string} text
 * @returns {string}
 */
export const cleanTextContent = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n|\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .split('\n')
    .map((line) => line.trim())
    .filter((line, i, arr) => line.length > 0 || (i > 0 && arr[i - 1].length > 0))
    .join('\n')
    .trim();
};

/**
 * Scrapes a single government scheme web page and extracts clean content
 *
 * @param {string} url - Target URL to scrape
 * @param {number} [timeout=15000] - HTTP request timeout in milliseconds
 * @returns {Promise<Object>} Extracted raw and clean content with metadata
 */
export const scrapeSchemeUrl = async (url, timeout = 15000) => {
  if (!url || !isValidUrl(url)) {
    throw new Error('A valid HTTP/HTTPS URL is required.');
  }

  try {
    const response = await axios.get(url, {
      headers: DEFAULT_HEADERS,
      timeout,
      maxRedirects: 5,
      responseType: 'text'
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract title & meta information
    const title =
      $('title').text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      'Untitled Scheme Page';

    const metaDescription =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      '';

    // Remove noise elements (scripts, styles, banners, navigation, footers)
    $(
      'script, style, noscript, nav, header, footer, svg, iframe, link, meta, select, button'
    ).remove();

    // Select primary content container if available, fallback to body
    let contentSelector = 'body';
    if ($('main').length) {
      contentSelector = 'main';
    } else if ($('article').length) {
      contentSelector = 'article';
    } else if ($('#content, #main-content, .content, .main-content').length) {
      contentSelector = '#content, #main-content, .content, .main-content';
    }

    const contentElement = $(contentSelector).first();

    // Extract clean plain text
    const rawText = contentElement.text();
    const cleanText = cleanTextContent(rawText);

    // Extract potential portal/application links
    const externalLinks = [];
    contentElement.find('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        externalLinks.push({ text: text || 'Link', url: href });
      }
    });

    // Extract clean HTML snippet (limited to 15KB to prevent bloat)
    const cleanedHtml = contentElement.html() || '';
    const cleanHtmlSnippet =
      cleanedHtml.length > 15000 ? cleanedHtml.substring(0, 15000) + '...' : cleanedHtml;

    return {
      sourceUrl: url,
      title,
      metaDescription,
      cleanText,
      cleanHtmlSnippet,
      meta: {
        textLength: cleanText.length,
        linksFoundCount: externalLinks.length,
        externalLinks: externalLinks.slice(0, 10),
        httpStatus: response.status
      },
      scrapedAt: new Date().toISOString()
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(`Connection timed out after ${timeout}ms while fetching ${url}`);
    }
    throw new Error(`Failed to scrape URL (${url}): ${error.message}`);
  }
};

/**
 * Scrapes multiple government scheme URLs in a batch
 *
 * @param {Array<string>} urls - Array of URL strings
 * @returns {Promise<Array<Object>>} Array of scrape outcomes
 */
export const batchScrape = async (urls = []) => {
  if (!Array.isArray(urls) || urls.length === 0) {
    return [];
  }

  // Cap batch limit to 10 URLs to protect memory and network
  const targetUrls = urls.slice(0, 10);

  const results = await Promise.allSettled(
    targetUrls.map((url) => scrapeSchemeUrl(url))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return {
        url: targetUrls[index],
        success: true,
        data: result.value
      };
    }
    return {
      url: targetUrls[index],
      success: false,
      error: result.reason.message
    };
  });
};
