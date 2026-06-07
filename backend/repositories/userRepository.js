const { getSupabaseClient } = require('../config/db')

/**
 * Repository layer to handle Database queries on profiles.
 */
class UserRepository {
  async findProfileByHandle(handle) {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('handle', handle)
      .maybeSingle()

    if (error) throw error
    return data
  }

  async findProfileById(id, token) {
    const supabase = getSupabaseClient(token)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }
}

module.exports = new UserRepository()
