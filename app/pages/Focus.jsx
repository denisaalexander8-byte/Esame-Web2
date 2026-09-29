import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import CommentThread from '../components/CommentThread.jsx';
import StoryCard from '../components/StoryCard.jsx';
import { getCommentChildren, getItemById } from '../services/api.js';
import { isReadLater, toggleReadLater } from '../services/storage.js';

/**
 * Pagina Focus: dettaglio di una story e albero dei commenti.
 * @returns {React.JSX.Element} - Componente Focus.
 */
function Focus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [inputValue, setInputValue] = useState(initialId);
  const [storyId, setStoryId] = useState(initialId);
  const [status, setStatus] = useState(initialId ? 'loading' : 'idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsStatus, setCommentsStatus] = useState('idle');
  
  useEffect(() => {
    if (!storyId) {
      return;
    } 

    let cancelled = false;

    async function loadThread() {
      setStatus('loading');
      setCommentsStatus('idle');

      try {
        const result = await getItemById(storyId);

        if (cancelled) {
          return;
        }

        if (!result || result.type !== 'story') {
          setStatus('invalid-type');
          return;
        }

        setStory(result);
        setStatus('ready');

        if (!Array.isArray(result.kids) || result.kids.length === 0) {
          setCommentsStatus('empty');
          return;
        }
       
        setCommentsStatus('loading');
        const firstLevelComments = await getCommentChildren(result);

        if (cancelled) {
          return;
        }

        if (!Array.isArray(firstLevelComments) || firstLevelComments.length === 0) {
          setCommentsStatus('empty');
          return;
        }
      
        setComments(firstLevelComments);
        setCommentsStatus('ready');
      } catch (error) {
        if (cancelled) {
          return;
        }

        setErrorMessage(error.message || 'Impossibile caricare il focus.');
        setStatus('error');
      }
    }

    loadThread();

    return () => {
      cancelled = true;
    };
  }, [storyId]);

  function handleLoad() {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setStatus('missing-input');
      return;
    }

    setSearchParams({ id: trimmed });
    setStoryId(trimmed);
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleLoad();
    }
  }

  return (
    <>
      <section className="page-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Focus</p>
            <h3>Apri una story e segui il thread</h3>
            <p className="section-subtitle">
              Inserisci un ID story per ottenere il pannello, i metadati essenziali e la discussione ad albero.
            </p>
          </div>
        </div>
         
        <div className="controls-bar">
          <div className="controls-group">
            <div className="field">
              <label htmlFor="thread-id-input">Story ID</label>
              <input
                id="thread-id-input"
                type="text"
                inputMode="numeric"
                placeholder="es. 45876493"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
          <button id="load-thread-button" className="btn btn-primary" type="button" onClick={handleLoad}>
            Carica focus
          </button>
        </div>
      </section>

      <section className="page-section thread-layout">
        <div id="thread-summary" className="thread-hero">
          {status === 'idle' && (
            <div className="state-panel empty">Inserisci un ID per aprire il focus della story.</div>
          )}
          {status === 'missing-input' && (
            <div className="state-panel error">
              <strong>Input mancante</strong>
              <p>Inserisci uno story ID valido.</p>
            </div>
          )}
          {status === 'loading' && <div className="state-panel loading">Carico il focus...</div>}
          {status === 'error' && (
            <div className="state-panel error">
              <strong>Errore</strong>
              <p>{errorMessage}</p>
            </div>
          )}
          {status === 'invalid-type' && (
            <div className="state-panel error">
              <strong>Tipo non valido</strong>
              <p>L'ID indicato non corrisponde a una story.</p>
            </div>
          )}
          {status === 'ready' && story && (
            <>
              <StoryCard
                story={story}
                showActions
                showThreadButton={false}
                feedVariant="focus"
                isSaved={isReadLater(story.id)}
                onToggleSave={(target) => toggleReadLater(target.id)}
              />
              <aside className="thread-panel">
                <h4>Dettagli rapidi</h4>
                <p>
                  <strong>Autore:</strong> {story.by || 'anon'}
                </p>
                <p>
                  <strong>Score:</strong> {story.score}
                </p>
                <p>
                  <strong>Commenti:</strong> {story.descendants}
                </p>
                <p>
                  <strong>Data:</strong> {story.timeLabel}
                </p>
                <p>
                  <strong>Fonte:</strong>{' '}
                  {story.url ? (
                    <a href={story.url} target="_blank" rel="noreferrer">
                      Apri fonte
                    </a>
                  ) : (
                    'Origine non disponibile'
                  )}
                </p>
              </aside>
            </>
          )}
        </div>
        <div id="thread-root">
          {status === 'ready' && (
            <>
              {commentsStatus === 'loading' && <div className="state-panel loading">Carico la discussione...</div>}
              {commentsStatus === 'empty' && (
                <div className="state-panel empty">Nessun commento disponibile per questa story.</div>
              )}
              {commentsStatus === 'ready' && <CommentThread comments={comments} depth={0} />}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Focus;
