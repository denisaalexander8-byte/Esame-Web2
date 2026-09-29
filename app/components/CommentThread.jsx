import { useState } from 'react';
import { getCommentChildren } from '../services/api.js';
import { stripHtml } from '../utils/text.js';

function CommentNode({ comment, depth = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState([]);

  const author = comment.by || 'anon';
  const text = stripHtml(comment.text || '').trim() || '[commento vuoto]';
  const hasKids = Array.isArray(comment.kids) && comment.kids.length > 0;

  async function handleToggle() {
    if (loaded) {
      setExpanded((current) => !current);
      return;
    }

    setLoading(true);
    const kids = await getCommentChildren(comment);
    setChildren(kids);
    setLoaded(true);
    setLoading(false);
    setExpanded(true);
  }

  let buttonLabel = `Apri risposte (${comment.kids?.length || 0})`;
  if (loading) {
    buttonLabel = 'Carico risposte...';
  } else if (loaded && expanded) {
    buttonLabel = 'Chiudi risposte';
    
  } 

  return (
    <article className={`comment-card comment-card--depth-${Math.min(depth, 5)}`}>
      <div className="comment-card__meta">
        <span className="comment-card__author">
          {comment.by && comment.by !== 'anon' ? (
            <a className="comment-author-link" href={`/profile?user=${encodeURIComponent(comment.by)}`}>
              {author}
            </a>
          ) : (
            author
          )}
        </span>
        <span className="comment-card__time">{comment.timeLabel || 'N/D'}</span>
        <span className="comment-card__badge">Profondità {depth}</span>
      </div>
      <div className="comment-card__body">
        <p>{text}</p>
      </div>
      <div className="comment-card__actions">
        {hasKids && (
          <button type="button" className="btn btn-secondary" disabled={loading} onClick={handleToggle}>
            {buttonLabel}
          </button>
        )}
      </div>
      {hasKids && (
        <div className={`comment-children${expanded ? '' : ' hidden'}`}>
          <CommentThread comments={children} depth={depth + 1} />
        </div>
      )}
    </article>
  );
}

/**
 * Renderizza ricorsivamente un elenco di commenti con caricamento lazy delle risposte.
 *
 * @param {object} props - Props del componente
 * @param {Array<object>} props.comments - Commenti da renderizzare
 * @param {number} [props.depth=0] - Profondità corrente
 * @returns {React.JSX.Element} - Componente CommentThread.
 */
function CommentThread({ comments, depth = 0 }) {
  const nodes = comments
    .filter((comment) => comment && comment.type === 'comment')
    .map((comment) => <CommentNode key={comment.id} comment={comment} depth={depth} />);

  if (depth === 0) {
    return <div className="thread-container">{nodes}</div>;
  }

  return nodes;
}

export default CommentThread;
