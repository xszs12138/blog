import { THEME_STORAGE_KEY } from '~/config/theme'

/**
 * 首屏防闪烁：在 Vue 水合前根据 cookie / localStorage / 系统偏好设置 .dark
 * 若仅有 localStorage 记录，会同步写入 cookie 供下次 SSR 使用。
 */
export default defineNuxtPlugin(() => {
  const key = THEME_STORAGE_KEY

  useHead({
    script: [
      {
        key: 'xszs-theme-init',
        innerHTML: `(function(){try{var k=${JSON.stringify(key)};var m=window.matchMedia('(prefers-color-scheme: dark)');function readCookie(name){var match=document.cookie.match(new RegExp('(?:^|; )'+name.replace(/[$()*+.?[\\]^{|}-]/g,'\\\\$&')+'=([^;]*)'));return match?decodeURIComponent(match[1]):null}var s=readCookie(k);if(!s){try{s=localStorage.getItem(k)}catch(e){}}if(s){try{document.cookie=k+'='+encodeURIComponent(s)+';path=/;SameSite=Lax;max-age=31536000'}catch(e){}}var dark=s==='dark'||(s!=='light'&&(s==='auto'?m.matches:s===null||!s));document.documentElement.classList.toggle('dark',!!dark)}catch(e){}})();`,
        tagPosition: 'head',
      },
    ],
  })
})
