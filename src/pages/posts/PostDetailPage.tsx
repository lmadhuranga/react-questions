import { Link, useParams } from 'react-router-dom'
import { Layout } from '../../components/Layout'
import { useGetPostQuery } from '../../services/postsApi'

export function PostDetailPage() {
  const { id } = useParams()
  const postId = Number(id)
  const { data, isLoading, error } = useGetPostQuery(postId, { skip: Number.isNaN(postId) })

  return (
    <Layout>
      <p className="eyebrow">Posts</p>
      <h1>Post details</h1>
      {isLoading && <p className="helper">Loading post…</p>}
      {error && <p className="error">Failed to load post</p>}
      {data && (
        <article className="card">
          <div className="meta">
            <span className="pill">#{data.id}</span>
            <span className="pill pill--subdued">User {data.userId}</span>
          </div>
          <h3>{data.title}</h3>
          <p className="helper">{data.body}</p>
          <div className="card-actions">
            <Link className="secondary" to={`/posts/edit/${data.id}`}>
              Edit
            </Link>
            <Link className="secondary" to="/posts">
              Back to list
            </Link>
          </div>
        </article>
      )}
    </Layout>
  )
}
