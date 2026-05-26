/**
 * 首屏防闪烁：在 Vue 水合前根据 localStorage / 系统偏好设置 .dark
 */
export default defineNuxtPlugin(() => {
  useHead({
    script: [
      {
        key: 'xszs-theme-init',
        innerHTML: `(function(){try{var k='xszs-color-mode';var s=localStorage.getItem(k);var m=window.matchMedia('(prefers-color-scheme: dark)');var dark=s==='dark'||(s!=='light'&&(s==='auto'?m.matches:s===null||!s));document.documentElement.classList.toggle('dark',!!dark)}catch(e){}})();`,
        tagPosition: 'head',
      },
    ],
  })
})
