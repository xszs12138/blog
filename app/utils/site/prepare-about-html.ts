import { renderMarkdown } from '~/utils/markdown/render-markdown'

import { preparePostHtml } from '~/utils/post/prepare-post-html'

/** 将关于页 Markdown 转为可安全展示的 HTML（复用文章消毒与标题 id） */
export function prepareAboutHtml(source: string) {
  const raw = renderMarkdown(source || '')
  return preparePostHtml(raw)
}
