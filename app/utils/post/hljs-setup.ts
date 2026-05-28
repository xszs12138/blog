import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

const LANGUAGE_MODULES = {
  bash,
  css,
  go,
  java,
  javascript,
  json,
  markdown,
  python,
  sql,
  typescript,
  xml,
} as const

export const HLJS_LANGUAGE_NAMES = Object.keys(
  LANGUAGE_MODULES,
) as (keyof typeof LANGUAGE_MODULES)[]

let registered = false

export function ensureHljsRegistered(): typeof hljs {
  if (!registered) {
    for (const [name, mod] of Object.entries(LANGUAGE_MODULES)) {
      hljs.registerLanguage(name, mod)
    }
    hljs.registerAliases(['html', 'vue'], { languageName: 'xml' })
    hljs.registerAliases(['js'], { languageName: 'javascript' })
    hljs.registerAliases(['ts'], { languageName: 'typescript' })
    hljs.registerAliases(['sh', 'shell', 'zsh'], { languageName: 'bash' })
    registered = true
  }
  return hljs
}

function normalizeLanguage(lang: string): string {
  const map: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    html: 'xml',
    vue: 'xml',
  }
  return map[lang] ?? lang
}

function detectLanguage(code: HTMLElement): string | undefined {
  for (const cls of code.classList) {
    if (cls.startsWith('language-')) {
      return normalizeLanguage(cls.slice(9))
    }
  }
  const dataLang = code.dataset.language?.trim()
  if (dataLang) {
    return normalizeLanguage(dataLang)
  }
  return undefined
}

/** 对 code 元素执行语法高亮（会改写 innerHTML） */
export function highlightCodeElement(code: HTMLElement): void {
  const hljsInstance = ensureHljsRegistered()
  const source = code.textContent ?? ''
  if (!source.trim()) {
    return
  }

  code.classList.add('hljs')

  const lang = detectLanguage(code)
  if (lang && hljsInstance.getLanguage(lang)) {
    const { value } = hljsInstance.highlight(source, { language: lang })
    code.innerHTML = value
    code.classList.add(`language-${lang}`)
    return
  }

  const result = hljsInstance.highlightAuto(source, [...HLJS_LANGUAGE_NAMES])
  code.innerHTML = result.value
  if (result.language) {
    code.classList.add(`language-${result.language}`)
  }
}
