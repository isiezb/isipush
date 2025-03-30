import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { showToast } from './toast-container.js';

export class StoryContinuation extends LitElement {
  static get properties() {
    return {
      originalStory: { type: Object },
      isSubmitting: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.originalStory = null;
    this.isSubmitting = false;
    this._continuationContent = '';
    this._showError = false;
    this._errorMessage = '';
    this._settings = {
      length: '300',
      difficulty: 'same_level'
    };
    this._vocabularyItems = [];
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid var(--border, rgba(0, 0, 0, 0.1));
        font-family: var(--font-body, 'Source Serif Pro', Georgia, 'Times New Roman', serif);
      }

      h3 {
        color: var(--primary, #5e7ce6);
        font-family: var(--font-heading, 'Inter', sans-serif);
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        font-weight: 700;
      }

      .continuation-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .continuation-options {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
        width: 100%;
      }

      .continuation-option {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .continuation-option label {
        font-weight: 600;
        font-family: var(--font-heading, 'Inter', sans-serif);
        font-size: 0.9rem;
        color: var(--text-secondary, #6c757d);
      }

      select {
        padding: 0.75rem;
        border: 1px solid var(--border, rgba(0, 0, 0, 0.1));
        border-radius: 8px;
        background-color: var(--bg, #f8f9fa);
        color: var(--text, #212529);
        font-family: var(--font-body, 'Source Serif Pro', Georgia, 'Times New Roman', serif);
        font-size: 0.95rem;
        min-width: 180px;
        transition: all 0.2s ease;
      }

      select:focus {
        outline: none;
        border-color: var(--primary, #5e7ce6);
        box-shadow: 0 0 0 3px rgba(94, 124, 230, 0.1);
      }

      button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        color: white;
        background: var(--primary, #5e7ce6);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        align-self: flex-start;
      }

      button:hover {
        background: var(--primary-600, #4a63b9);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
      }

      button:disabled {
        background: var(--gray-500, #adb5bd);
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .spinner {
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .continuation-output {
        padding: 1.5rem 0;
        animation: fadeIn 0.5s ease-in-out;
      }

      .continuation-content {
        line-height: 1.7;
        color: var(--text, #212529);
      }

      .continuation-content p {
        margin-bottom: 1rem;
      }

      .continuation-error {
        color: var(--error, #f56565);
        padding: 1rem;
        border-radius: 8px;
        background-color: rgba(245, 101, 101, 0.1);
        border: 1px solid var(--error, #f56565);
        margin-top: 1rem;
      }

      .difficulty-description {
        width: 100%;
        margin: 1rem 0;
        transition: all 0.3s ease;
      }

      .difficulty-description-content {
        padding: 1rem;
        border-radius: 8px;
        background-color: var(--bg, #f8f9fa);
        border-left: 4px solid var(--primary, #5e7ce6);
        transition: all 0.3s ease;
      }

      .difficulty-description-content h4 {
        font-family: var(--font-heading, 'Inter', sans-serif);
        font-size: 1rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--text, #212529);
      }

      .difficulty-description-content p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--text-secondary, #6c757d);
      }

      .difficulty-description-content.easier {
        border-left-color: var(--info, #38b2ac);
      }

      .difficulty-description-content.same {
        border-left-color: var(--primary, #5e7ce6);
      }

      .difficulty-description-content.harder {
        border-left-color: var(--warning, #d69e2e);
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 768px) {
        .continuation-options {
          flex-direction: column;
          gap: 0.75rem;
        }

        button {
          width: 100%;
        }
      }

      /* Vocabulary styling */
      .vocabulary-section {
        margin-top: 2rem;
        background-color: #f9f9f9;
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid #4285f4;
      }
      
      .vocabulary-section h3 {
        color: #333;
        margin-top: 0;
        margin-bottom: 1rem;
        font-size: 1.25rem;
      }
      
      .vocabulary-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }
      
      .vocabulary-item {
        background: white;
        padding: 1rem;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        transition: transform 0.2s ease;
      }
      
      .vocabulary-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
      
      .vocabulary-term {
        color: #4285f4;
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
      }
      
      .vocabulary-definition {
        color: #555;
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.4;
      }
      
      /* Continuation result styling */
      .continuation-result {
        background-color: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .continuation-content {
        line-height: 1.6;
        color: #333;
      }
      
      .continuation-content p {
        margin-bottom: 1rem;
      }
    `;
  }

  _handleInputChange(e) {
    const { name, value } = e.target;
    this._settings = {
      ...this._settings,
      [name]: value
    };
    this.requestUpdate();
  }

  async _handleContinue() {
    if (this.isSubmitting) return; 
    
    this.isSubmitting = true;
    this._continuationContent = '';
    this._showError = false;
    this._errorMessage = '';
    this.render();
    
    const originalStory = this.originalStory || {};
    const storyId = originalStory.id || 'unknown';
    const originalContent = originalStory.content || '';
    
    // Map UI difficulty values to API values
    const difficultyMap = {
        'much_easier': 'much_easier',
        'slightly_easier': 'slightly_easier', 
        'same_level': 'same_level',
        'slightly_harder': 'slightly_harder',
        'much_harder': 'much_harder'
    };
    
    const options = {
        length: parseInt(this._settings.length, 10),
        difficulty: difficultyMap[this._settings.difficulty] || 'same_level',
        original_story_content: originalContent
    };
    
    // Log what we're about to do
    console.log(`Continuing story ${storyId} with options:`, options);
    
    // Use the API service to continue the story
    window.apiService.continueStory(storyId, options)
        .then(data => {
            this.isSubmitting = false;
            
            // Process the continuation response
            if (data && data.continuation_text) {
                this._continuationContent = data.continuation_text;
                
                // Process vocabulary items if available
                if (data.vocabulary && Array.isArray(data.vocabulary)) {
                    console.log('New vocabulary items:', data.vocabulary);
                    this._vocabularyItems = data.vocabulary;
                } else {
                    this._vocabularyItems = [];
                }
                
                // Dispatch event that continuation is ready
                const event = new CustomEvent('story-continued', { 
                    detail: { 
                        continuation: data.continuation_text,
                        difficulty: data.difficulty,
                        wordCount: data.word_count,
                        vocabulary: data.vocabulary
                    } 
                });
                document.dispatchEvent(event);
            } else {
                throw new Error('Received empty or invalid continuation response');
            }
            
            this.render();
        })
        .catch(error => {
            console.error('Error continuing story:', error);
            this.isSubmitting = false;
            this._showError = true;
            this._errorMessage = `Failed to continue the story: ${error.message || 'Unknown error'}`;
            this.render();
            
            // Use mock data in development if API is unavailable
            if (window.ENV_USE_MOCK_DATA === true) {
                console.log('Using mock continuation data...');
                setTimeout(() => {
                    this._continuationContent = "This is a mock continuation of the story. It would normally come from the API but is being generated locally for development purposes.\n\nThe characters continue their adventure with enthusiasm, learning more about their subject along the way.";
                    this.isSubmitting = false;
                    this._showError = false;
                    this._errorMessage = '';
                    this.render();
                }, 1500);
            }
        });
  }

  render() {
    if (this._showError) {
      return `
        <div class="continuation-error">
          <p>${this._errorMessage}</p>
        </div>
      `;
    }

    if (this._continuationContent) {
      const formattedContinuation = this._continuationContent.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
      return `
        <div class="continuation-result">
          <h3>Story Continuation</h3>
          <div class="continuation-content">
            <p>${formattedContinuation}</p>
          </div>
          ${this._renderVocabulary()}
        </div>
      `;
    }

    return `
      <div class="continuation-form">
        <h3>Continue the Story</h3>
        
        <div class="input-group">
          <label for="length">Length</label>
          <select 
            id="length" 
            name="length" 
            @change="${this._handleInputChange}"
            ?disabled="${this.isSubmitting}"
          >
            <option value="200" ${this._settings.length === '200' ? 'selected' : ''}>Short (200 words)</option>
            <option value="300" ${this._settings.length === '300' ? 'selected' : ''}>Medium (300 words)</option>
            <option value="500" ${this._settings.length === '500' ? 'selected' : ''}>Long (500 words)</option>
          </select>
        </div>
        
        <div class="input-group">
          <label for="difficulty">Difficulty</label>
          <select 
            id="difficulty" 
            name="difficulty" 
            @change="${this._handleInputChange}"
            ?disabled="${this.isSubmitting}"
          >
            <option value="much_easier" ${this._settings.difficulty === 'much_easier' ? 'selected' : ''}>Much Easier</option>
            <option value="slightly_easier" ${this._settings.difficulty === 'slightly_easier' ? 'selected' : ''}>Slightly Easier</option>
            <option value="same_level" ${this._settings.difficulty === 'same_level' ? 'selected' : ''}>Same Level</option>
            <option value="slightly_harder" ${this._settings.difficulty === 'slightly_harder' ? 'selected' : ''}>Slightly Harder</option>
            <option value="much_harder" ${this._settings.difficulty === 'much_harder' ? 'selected' : ''}>Much Harder</option>
          </select>
        </div>
        
        ${this._renderDifficultyDescription()}
        
        <button 
          class="continue-button ${this.isSubmitting ? 'loading' : ''}" 
          @click="${this._handleContinue}"
          ?disabled="${this.isSubmitting}"
        >
          ${this.isSubmitting ? 
            '<div class="spinner"></div> Generating...' : 
            'Continue Story'
          }
        </button>
      </div>
    `;
  }

  _renderDifficultyDescription() {
    const descriptions = {
      'much_easier': {
        title: 'Much Easier',
        description: 'Uses significantly simpler vocabulary and shorter sentences. Ideal for building confidence with beginner readers or those struggling with the original difficulty level.',
        class: 'easier'
      },
      'slightly_easier': {
        title: 'Slightly Easier',
        description: 'Moderately simplifies vocabulary and sentence structure. Good for readers who found the original slightly challenging.',
        class: 'easier'
      },
      'same_level': {
        title: 'Same Level',
        description: 'Maintains the same vocabulary level and sentence complexity as the original story.',
        class: 'same'
      },
      'slightly_harder': {
        title: 'Slightly Harder',
        description: 'Introduces somewhat more advanced vocabulary and more complex sentences. Good for readers ready for a small challenge.',
        class: 'harder'
      },
      'much_harder': {
        title: 'Much Harder',
        description: 'Uses significantly more advanced vocabulary and complex sentence structures. Ideal for pushing advanced readers to the next level.',
        class: 'harder'
      }
    };

    const selected = descriptions[this._settings.difficulty] || descriptions['same_level'];

    return `
      <div class="difficulty-description">
        <div class="difficulty-description-content ${selected.class}">
          <h4>${selected.title}</h4>
          <p>${selected.description}</p>
        </div>
      </div>
    `;
  }

  _renderVocabulary() {
    if (!this._vocabularyItems || this._vocabularyItems.length === 0) {
        return '';
    }

    const vocabItems = this._vocabularyItems.map(item => `
        <div class="vocabulary-item">
            <h4 class="vocabulary-term">${item.term}</h4>
            <p class="vocabulary-definition">${item.definition}</p>
        </div>
    `).join('');

    return `
        <div class="vocabulary-section">
            <h3>New Vocabulary</h3>
            <div class="vocabulary-list">
                ${vocabItems}
            </div>
        </div>
    `;
  }
}

customElements.define('story-continuation', StoryContinuation); 