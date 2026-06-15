import type { TocItem } from '~/types/toc'

import { renderMarkdown } from '~/utils/markdown/render-markdown'

import { preparePostHtml } from './prepare-post-html'

/** 按 contentType 将文章正文转为可安全展示的 HTML，并生成目录 */
export function preparePostContent(
  content: string,
  contentType?: string,
): {
  html: string
  toc: TocItem[]
} {
  const source = content?.trim() ?? ''
  if (!source) {
    return { html: '', toc: [] }
  }

  const rawHtml =
    contentType === 'html' ? source : renderMarkdown(source)

  return preparePostHtml(rawHtml)
}
