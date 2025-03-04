import { json, error as server_error } from '@sveltejs/kit';
import supabase_admin from '$lib/supabase/admin'
import axios, { USER_AGENT } from '$lib/axios'

export async function POST({ request, locals }) {
  const session = await locals.getSession()
  if (!session) {
    // the user is not signed in
    throw server_error(401, { message: 'Unauthorized' })
  }

  const { repo_name, files } = await request.json();

  const { data: token } = await supabase_admin.from('config').select('value').single()

  const res = await Promise.all(files.map(async file => {
    const blob_sha = await create_blob({ content: file.data, token: token.value, repo_name })
    return {
      path: file.file,
      sha: blob_sha
    }
  }))

  return json(res)
}

async function create_blob({ content, token, repo_name }) {
  const { data } = await axios.post(`https://api.github.com/repos/${repo_name}/git/blobs`, {
    content: content,
    encoding: 'utf-8'
  },
    {
      headers: { ...USER_AGENT, Authorization: `Bearer ${token}` }
    });

  return data.sha;
}