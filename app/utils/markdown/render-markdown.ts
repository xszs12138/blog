import MarkdownIt from 'markdown-it'

import {
  ensureHljsRegistered,
  HLJS_LANGUAGE_NAMES,
} from '~/utils/post/hljs-setup'

function highlightCode(code: string, lang: string): string {
  const hljs = ensureHljsRegistered()
  const language = lang.trim().toLowerCase()

  if (language && hljs.getLanguage(language)) {
    return hljs.highlight(code, { language }).value
  }

  const result = hljs.highlightAuto(code, [...HLJS_LANGUAGE_NAMES])
  return result.value
}

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  highlight(code, lang) {
    const highlighted = highlightCode(code, lang)
    const languageClass = lang
      ? ` class="language-${lang.trim().toLowerCase()}"`
      : ''
    return `<pre><code${languageClass}>${highlighted}</code></pre>`
  },
})

/** 将 Markdown 转为 HTML（与后台 md-editor-v3 存储格式对齐） */
export function renderMarkdown(source: string): string {
  return markdown.render(source || '')
}
