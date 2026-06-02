import MarkdownIt from 'markdown-it'

import { preparePostHtml } from '~/utils/post/prepare-post-html'

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

/** 将关于页 Markdown 转为可安全展示的 HTML（复用文章消毒与标题 id） */
export function prepareAboutHtml(source: string) {
  const raw = markdown.render(source || '')
  return preparePostHtml(raw)
}
