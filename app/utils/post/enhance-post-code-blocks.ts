import { highlightCodeElement } from '~/utils/post/hljs-setup'

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`

const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`

function getCodeText(pre: HTMLPreElement): string {
  const code = pre.querySelector('code')
  return (code ?? pre).textContent ?? ''
}

function buildGutter(lineCount: number): HTMLDivElement {
  const gutter = document.createElement('div')
  gutter.className = 'post-code-block__gutter'
  gutter.setAttribute('aria-hidden', 'true')

  for (let i = 1; i <= lineCount; i++) {
    const line = document.createElement('span')
    line.className = 'post-code-block__line-num'
    line.textContent = String(i)
    gutter.appendChild(line)
  }

  return gutter
}

function createCopyButton(rawText: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'post-code-block__copy'
  button.setAttribute('aria-label', '复制到剪贴板')
  button.title = 'Copy to clipboard'
  button.innerHTML = COPY_ICON

  let resetTimer: ReturnType<typeof setTimeout> | undefined

  button.addEventListener('click', async () => {
    const text = rawText.replace(/\r\n/g, '\n')
    if (!text.trim()) {
      return
    }

    try {
      await navigator.clipboard.writeText(text)
    }
    catch {
      return
    }

    button.classList.add('is-copied')
    button.title = 'Copied!'
    button.innerHTML = CHECK_ICON

    if (resetTimer) {
      clearTimeout(resetTimer)
    }
    resetTimer = setTimeout(() => {
      button.classList.remove('is-copied')
      button.title = 'Copy to clipboard'
      button.innerHTML = COPY_ICON
      resetTimer = undefined
    }, 2000)
  })

  return button
}

/** 为富文本中的 pre 代码块做语法高亮，并包裹行号栏与复制按钮（仅客户端） */
export function enhancePostCodeBlocks(root: HTMLElement | null): void {
  if (!root) {
    return
  }

  root.querySelectorAll('pre').forEach((node) => {
    const pre = node as HTMLPreElement
    if (pre.closest('.post-code-block')) {
      return
    }

    const rawText = getCodeText(pre)
    if (!rawText.trim()) {
      return
    }

    const code = pre.querySelector('code')
    if (code) {
      highlightCodeElement(code)
    }

    const lines = rawText.replace(/\r\n/g, '\n').split('\n')
    const lineCount = Math.max(lines.length, 1)

    const wrapper = document.createElement('div')
    wrapper.className = 'post-code-block'

    const copyBtn = createCopyButton(rawText)
    const inner = document.createElement('div')
    inner.className = 'post-code-block__inner'

    const gutter = buildGutter(lineCount)

    pre.parentNode?.insertBefore(wrapper, pre)
    inner.append(gutter, pre)
    wrapper.append(copyBtn, inner)
  })
}
