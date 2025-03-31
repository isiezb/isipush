import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { showToast } from '../toast-container.js';

export class StoryUtilities extends LitElement {
  static properties = {
    story: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border, rgba(0, 0, 0, 0.1));
    }
    
    .utility-container {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin: 0 auto;
    }
    
    .utility-button {
      display: flex;
      align-items: center;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      background-color: var(--neutral-50);
      border: 1px solid var(--border);
      color: var(--text);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .utility-button:hover {
      background-color: var(--neutral-100);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }
    
    .utility-button svg {
      width: 16px;
      height: 16px;
      margin-right: 0.5rem;
    }
    
    @media (max-width: 600px) {
      .utility-container {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
      
      .utility-button {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  constructor() {
    super();
    this.story = null;
  }

  _getStoryText() {
    if (!this.story || !this.story.content) {
      return '';
    }
    
    let text = `${this.story.title || 'Educational Story'}\n\n`;
    text += this.story.content;
    
    if (this.story.summary) {
      text += '\n\nSummary:\n' + this.story.summary;
    }
    
    if (this.story.vocabulary && this.story.vocabulary.length > 0) {
      text += '\n\nVocabulary:\n';
      this.story.vocabulary.forEach(item => {
        text += `- ${item.term}: ${item.definition}\n`;
      });
    }
    
    return text;
  }

  _copyToClipboard() {
    const text = this._getStoryText();
    
    if (!text) {
      showToast?.('No story content to copy', 'error');
      return;
    }
    
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast?.('Story copied to clipboard!', 'success');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        showToast?.('Failed to copy to clipboard', 'error');
      });
  }

  _shareStory() {
    const text = this._getStoryText();
    
    if (!text) {
      showToast?.('No story content to share', 'error');
      return;
    }
    
    if (navigator.share) {
      navigator.share({
        title: this.story.title || 'Educational Story',
        text: text
      })
      .then(() => {
        showToast?.('Story shared successfully!', 'success');
      })
      .catch(err => {
        console.error('Share failed:', err);
        // Fallback to copy
        this._copyToClipboard();
      });
    } else {
      // Fallback for browsers that don't support sharing
      this._copyToClipboard();
      showToast?.('Share not supported, copied to clipboard instead', 'info');
    }
  }

  _printStory() {
    const text = this._getStoryText();
    
    if (!text) {
      showToast?.('No story content to print', 'error');
      return;
    }
    
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      showToast?.('Popup blocked. Please allow popups and try again.', 'error');
      return;
    }
    
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${this.story.title || 'Educational Story'}</title>
        <style>
          body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            margin: 2rem;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }
          h1 {
            text-align: center;
            margin-bottom: 2rem;
          }
          h2 {
            margin-top: 2rem;
          }
          .footer {
            margin-top: 2rem;
            text-align: center;
            font-size: 0.9rem;
            color: #666;
          }
          .vocabulary-item {
            margin-bottom: 0.5rem;
          }
        </style>
      </head>
      <body>
        <h1>${this.story.title || 'Educational Story'}</h1>
        <div>${this.story.content.replace(/\n/g, '<br>')}</div>
        ${this.story.summary ? `<h2>Summary</h2><div>${this.story.summary}</div>` : ''}
        ${this.story.vocabulary && this.story.vocabulary.length > 0 ? `
          <h2>Vocabulary</h2>
          <div>
            ${this.story.vocabulary.map(item => `
              <div class="vocabulary-item">
                <strong>${item.term}</strong>: ${item.definition}
              </div>
            `).join('')}
          </div>
        ` : ''}
        <div class="footer">
          Generated by EASY STORY EASY LIFE
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      // Some browsers may close the window after print, others won't
    }, 500);
  }

  render() {
    return html`
      <div class="utility-container">
        <button class="utility-button" @click="${this._copyToClipboard}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        </button>
        
        <button class="utility-button" @click="${this._shareStory}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share
        </button>
        
        <button class="utility-button" @click="${this._printStory}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          Print
        </button>
      </div>
    `;
  }
}

// Guard against duplicate registration
if (!customElements.get('story-utilities')) {
  customElements.define('story-utilities', StoryUtilities);
} 