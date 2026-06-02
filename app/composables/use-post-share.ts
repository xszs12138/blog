export interface PostShareOptions {
  url: string
  title: string
}

export function buildPostShareLinks({ url, title }: PostShareOptions) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`,
    qq: `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}`,
  }
}

export function usePostShareUrl(slug: string) {
  const requestURL = useRequestURL()

  return computed(() => {
    const path = `/post/${encodeURIComponent(slug)}`
    return `${requestURL.origin}${path}`
  })
}

function copyWithExecCommand(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.left = '0'
  textarea.style.width = '1px'
  textarea.style.height = '1px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  }
  catch {
    ok = false
  }
  document.body.removeChild(textarea)
  return ok
}

export async function copyPostLink(url: string): Promise<boolean> {
  if (!import.meta.client || !url) {
    return false
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url)
      return true
    }
    catch {
      // 部分浏览器非 HTTPS 会失败，走兜底
    }
  }

  return copyWithExecCommand(url)
}
