import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class StoryHeader extends LitElement {
  static properties = {
    story: { type: Object }
  };

  static styles = css`
    .story-header {
      margin-bottom: 1.5rem;
    }

    .story-title {
      font-family: var(--font-heading, 'Inter', sans-serif);
      font-size: 2rem;
      color: var(--text, #212529);
      margin: 0 0 1rem 0;
    }

    .story-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      color: var(--text-secondary, #6c757d);
      font-size: 0.875rem;
    }

    .story-meta-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .section-title {
      font-family: var(--font-heading, 'Inter', sans-serif);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary, #5e7ce6);
      margin: 0 0 1.5rem 0;
      padding-bottom: 0.75rem;
      position: relative;
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 60px;
      height: 3px;
      background-color: var(--primary, #5e7ce6);
      border-radius: 3px;
    }
  `;

  constructor() {
    super();
    this.story = null;
  }

  _formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }

  render() {
    if (!this.story) {
      return html`<div class="story-header">
        <h2 class="section-title">Story</h2>
      </div>`;
    }

    return html`
      <div class="story-header">
        <h1 class="story-title">${this.story.title}</h1>
        <div class="story-meta">
          <div class="story-meta-item">
            <span>Subject:</span> 
            <strong>${this.story.subject}</strong>
          </div>
          <div class="story-meta-item">
            <span>Grade Level:</span> 
            <strong>${this.story.academic_grade}</strong>
          </div>
          <div class="story-meta-item">
            <span>Words:</span> 
            <strong>${this.story.word_count}</strong>
          </div>
          ${this.story.created_at ? html`
            <div class="story-meta-item">
              <span>Created:</span> 
              <strong>${this._formatDate(this.story.created_at)}</strong>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}


// Guard against duplicate registration
if (!customElements.get('story-header')) {
  customElements.define('story-header', StoryHeader);
}