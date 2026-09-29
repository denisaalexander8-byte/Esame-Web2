import { useState } from 'react';
import { useNavigate } from 'react-router';

function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (_error) {
    return '';
  }
}

/**
 * Card di una story.
 *
 * @param {object} props - Props del componente
 * @param {object} props.story - Story normalizzata
 * @param {boolean} [props.showActions=false] - Mostra azioni
 * @param {boolean} [props.showThreadButton=true] - Mostra pulsante thread
 * @param {string} [props.feedVariant="default"] - Variante visiva
 * @param {boolean} [props.isSaved=false] - Indica se salvata
 * @param {Function} [props.onToggleSave] - Callback toggle archivio, riceve la story e può restituire il nuovo stato "saved"
 * @returns {React.JSX.Element} - Componente StoryCard.
 */
function StoryCard({
  story,
  showActions = false,
  showThreadButton = true,
  feedVariant = 'default',
  isSaved = false,
  onToggleSave,
}) {
  const [saved, setSaved] = useState(isSaved);
  const navigate = useNavigate();

  const title = story.title || 'Senza titolo';
  const author = story.by || 'anon';
  const threadHref = `/focus?id=${encodeURIComponent(story.id)}`;
  const scoreLabel = `${story.score} punti`;
  const commentsLabel = `${story.descendants} commenti`;
  const timeLabel = story.timeLabel || 'N/D';
  const domain = story.url ? getHostname(story.url) : '';
  const excerpt = (story.text || domain || 'Story in evidenza').replace(/\s+/g, ' ').trim().slice(0, 160);

  const sourceLink = story.url ? (
    <a className="story-source-link" href={story.url} target="_blank" rel="noreferrer">
      Apri fonte{domain ? ` · ${domain}` : ''}
    </a>
  ) : (
    <span className="story-source-link story-source-link--disabled">Origine non disponibile</span>
  );

  const authorLink =
    author !== 'anon' ? <a href={`/profile?user=${encodeURIComponent(story.by)}`}>{author}</a> : author;

  function handleToggleSave() {
    const result = onToggleSave?.(story);

    if (typeof result === 'boolean') {
      setSaved(result);
    }
  }

  const cardClasses = ['story-card'];
  if (feedVariant !== 'default') {
    cardClasses.push(`story-card--${feedVariant}`);
  }
  if (feedVariant === 'list') {
    cardClasses.push('story-card--interactive-list');
  }

  const isInteractiveList = feedVariant === 'list';

  function handleCardClick(event) {
    if (!isInteractiveList || event.target.closest('a, button')) {
      return;
    }

    navigate(threadHref);
  }

  function handleCardKeyDown(event) {
    if (!isInteractiveList) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(threadHref);
    }
  }

  const actions = showActions ? (
    <div className="story-actions">
      {showThreadButton && (
        <a className="btn btn-secondary btn-thread" href={threadHref}>
          Apri focus
        </a>
      )}
      <button
        type="button"
        className={`btn btn-secondary btn-save${saved ? ' is-saved' : ''}`}
        aria-label={saved ? "Rimuovi dall'archivio" : "Salva nell'archivio"}
        onClick={handleToggleSave}
      >
        {saved ? 'Salvata' : 'Salva'}
      </button>
    </div>
  ) : (
    showThreadButton && (
      <a className="btn btn-secondary btn-thread" href={threadHref}>
        Apri focus
      </a>
    )
  );

  return (
    <article
      className={cardClasses.join(' ')}
      data-thread-href={threadHref}
      tabIndex={isInteractiveList ? 0 : undefined}
      role={isInteractiveList ? 'link' : undefined}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="story-card__top">
        <div className="story-card__heading">
          <p className="story-card__eyebrow">#{story.id}</p>
          <h3 className="story-card__title">
            <a href={threadHref}>{title}</a>
          </h3>
        </div>
        {actions}
      </div>

      <div className="story-card__meta">
        <span className="chip chip--score">{scoreLabel}</span>
        <span className="chip chip--comments">{commentsLabel}</span>
        <span className="chip chip--time">{timeLabel}</span>
        <span className="chip chip--author">{authorLink}</span>
      </div>

      <p className="story-card__excerpt">{excerpt}</p>
      <div className="story-card__footer">
        {sourceLink}
        <span className="story-card__footnote">ID {story.id}</span>
      </div>
    </article>
  );
}

export default StoryCard;