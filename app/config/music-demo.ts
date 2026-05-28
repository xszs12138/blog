import type { MusicTrack } from '~/types/music'

/** 临时静态歌单，后续替换为 /api/web/music 等接口 */
export const demoMusicPlaylist: MusicTrack[] = [
  {
    id: 'demo-1',
    name: 'Gently Wipe The Sorrow',
    artist: '知更鸟 / HOYO-MiX / Chevy',
    url: '/1.mp3',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=320&q=80',
    lrc: `[00:12.00]Let the clouds drift through the night
    [00:18.50]Gently wipe the sorrow off my life
    [00:25.00]I dream, and I still believe
    [00:31.50]In the warm light crossing winter skies
    [00:38.00]Let the wind carry every goodbye
    [00:44.50]I dream, and I still believe
    [00:51.00]The dawn is waiting just beyond the rain
    [00:57.50]Hold my hand and walk through all the pain
    [01:04.00]Every fading scar can turn to light
    [01:10.50]Every lonely road can lead us home
    [01:17.00]When the world goes quiet, hear my song
    [01:23.50]When the stars are falling, stay with me
    [01:30.00]I still hear the promise in your voice
    [01:36.50]I still keep the fire in my heart
    [01:43.00]No more running from the dark tonight
    [01:49.50]No more hiding from the morning glow
    [01:56.00]Gently wipe the sorrow off my life
    [02:02.50]And let a softer dream begin again
    [02:09.00]Let the clouds drift through the night
    [02:15.50]Gently wipe the sorrow off my life`,
  },
]
