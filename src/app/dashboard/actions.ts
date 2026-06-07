'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

/**
 * Validates a URL to ensure it starts with http:// or https://.
 * If not, prepend https:// automatically for a better user experience.
 */
function cleanUrl(url: string): string {
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

export async function addBookmark(formData: FormData) {
  const title = formData.get('title') as string
  const rawUrl = formData.get('url') as string
  const isPublic = formData.get('isPublic') === 'true'

  if (!title || !rawUrl) {
    return { error: 'Title and URL are required.' }
  }

  const url = cleanUrl(rawUrl)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated.' }
  }

  const { error } = await supabase.from('bookmarks').insert({
    user_id: user.id,
    title: title.trim(),
    url: url,
    is_public: isPublic,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/[handle]`, 'layout')
  return { success: true }
}

export async function updateBookmark(formData: FormData) {
  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const rawUrl = formData.get('url') as string
  const isPublic = formData.get('isPublic') === 'true'

  if (!id || !title || !rawUrl) {
    return { error: 'Bookmark ID, Title, and URL are required.' }
  }

  const url = cleanUrl(rawUrl)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated.' }
  }

  // Perform the update. The database RLS will also block this if user_id doesn't match auth.uid().
  const { error } = await supabase
    .from('bookmarks')
    .update({
      title: title.trim(),
      url: url,
      is_public: isPublic,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/[handle]`, 'layout')
  return { success: true }
}

export async function deleteBookmark(id: string) {
  if (!id) {
    return { error: 'Bookmark ID is required.' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated.' }
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/[handle]`, 'layout')
  return { success: true }
}
