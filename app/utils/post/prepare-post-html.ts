import type { TocItem } from '~/types/toc'
import * as cheerio from 'cheerio'

import DOMPurify from 'isomorphic-dompurify'
import { slugifyHeading } from '~/utils/post/slugify-heading'

const PURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'del',
    'a',
    'img',
    'ul',
    'ol',
    'li',
    'blockquote',
    'pre',
    'code',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'hr',
    'span',
    'div',
    'figure',
    'figcaption',
    'sup',
    'sub',
  ],
  ALLOWED_ATTR: [
    'href',
    'target',
    'rel',
    'src',
    'alt',
    'title',
    'class',
    'id',
    'colspan',
    'rowspan',
  ],
}

function headingText($: cheerio.CheerioAPI, el: Parameters<typeof $>[0]): string {
  return $(el).text().replace(/\s+/g, ' ').trim()
}

const HEADING_SELECTOR = 'h2, h3'

/** 消毒富文本 HTML（html 类型文章兜底） */
export function sanitizePostHtml(rawHtml: string): string {
  return DOMPurify.sanitize(rawHtml || '', PURIFY_CONFIG)
}

/** 消毒富文本 HTML，并为 h2/h3 注入 id，生成目录（不含 h1） */
export function preparePostHtml(rawHtml: string): {
  html: string
  toc: TocItem[]
} {
  const sanitized = sanitizePostHtml(rawHtml)
  if (!sanitized.trim()) {
    return { html: '', toc: [] }
  }

  const $ = cheerio.load(sanitized, {}, false)
  const toc: TocItem[] = []
  const usedIds = new Set<string>()
  let index = 0

  $(HEADING_SELECTOR).each((_, el) => {
    const tag = el.tagName?.toLowerCase()
    if (tag !== 'h2' && tag !== 'h3') {
      return
    }

    const text = headingText($, el)
    if (!text) {
      return
    }

    const level = tag === 'h2' ? 2 : 3
    const existingId = $(el).attr('id')?.trim()
    let id: string
    if (existingId && !usedIds.has(existingId)) {
      id = existingId
      usedIds.add(id)
    }
    else {
      id = slugifyHeading(text, index++, usedIds)
    }
    $(el).attr('id', id)
    toc.push({ id, text, level })
  })

  return {
    html: $.html(),
    toc,
  }
}

/** 从 Markdown / 纯文本估算阅读分钟数 */
export function estimateReadingMinutesFromText(text?: string): number {
  if (!text?.trim()) {
    return 1
  }
  const len = text.replace(/\s+/g, '').length
  if (!len) {
    return 1
  }
  return Math.max(1, Math.ceil(len / 400))
}

/** @deprecated 使用 estimateReadingMinutesFromText */
export function estimateReadingMinutesFromHtml(html?: string): number {
  if (!html?.trim()) {
    return 1
  }
  const text = cheerio.load(html).root().text().replace(/\s+/g, '')
  if (!text.length) {
    return 1
  }
  return Math.max(1, Math.ceil(text.length / 400))
}
