export interface CommentGuestInfo {
  nickname: string
  email: string
  website: string
}

const STORAGE_KEY = 'xszs-comment-guest'

export function useCommentGuest() {
  const guest = useLocalStorage<CommentGuestInfo>(STORAGE_KEY, {
    nickname: '',
    email: '',
    website: '',
  })

  function saveGuest(info: CommentGuestInfo) {
    guest.value = {
      nickname: info.nickname.trim(),
      email: info.email.trim(),
      website: info.website.trim(),
    }
  }

  return {
    guest,
    saveGuest,
  }
}
