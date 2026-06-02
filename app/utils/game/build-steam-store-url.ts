/** Steam 商店详情页（仅需 App ID，无需再请求接口） */
export function buildSteamStoreUrl(steamAppId: number): string {
  return `https://store.steampowered.com/app/${steamAppId}/`
}
