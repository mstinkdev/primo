import { json, error as server_error } from '@sveltejs/kit';
import supabase_admin from '$lib/supabase/admin'
import axios, { USER_AGENT } from '$lib/axios'

export async function GET({ locals }) {

  const session = await locals.getSession()
  if (!session) {
    // the user is not signed in
    throw server_error(401, { message: 'Unauthorized' })
  }

  const { data: token, error } = await supabase_admin.from('config').select('value').single()

  const headers = { ...USER_AGENT, Authorization: `Bearer ${token.value}` }

  const { data } = await axios.get(`https://api.github.com/user`, {
    headers: { ...headers, Accept: 'application/vnd.github.v3+json' }
  })

  return json(data);
}