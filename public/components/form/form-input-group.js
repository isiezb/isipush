import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class FormInputGroup extends LitElement {
  static properties = {
    label: { type: String },
    name: { type: String },
    type: { type: String },
    placeholder: { type: String },
    value: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean },
    options: { type: Array },
    hidden: { type: Boolean }
  };

  static styles = css`
    .input-group {
      flex: 1 1 275px;
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.75rem; 
      font-family: var(--font-heading, 'Inter', sans-serif);
      font-weight: 600;
      color: var(--text, #212529);
    }

    .input-group input, 
    .input-group select {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      border: 2px solid var(--border, rgba(0, 0, 0, 0.1));
      border-radius: 12px;
      background-color: var(--card-bg, white);
      color: var(--text, #212529);
      font-family: var(--font-body, 'Source Serif Pro', Georgia, 'Times New Roman', serif);
      transition: var(--transition-fast, all 0.2s ease);
      margin-top: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .input-group input:focus,
    .input-group select:focus {
      outline: none;
      border-color: var(--primary, #5e7ce6);
      box-shadow: 0 0 0 3px rgba(94, 124, 230, 0.25);
    }

    /* Make input fields more visible */
    .input-group input {
      background-color: #fff;
      border: 2px solid rgba(0, 0, 0, 0.15);
    }

    /* Special styling for optional fields */
    .optional-field input,
    .optional-field select {
      padding: 0.75rem;
      font-size: 0.95rem;
      border-width: 1px;
      margin-bottom: 0.5rem;
      /* Slightly smaller to prevent overlap */
      max-width: 95%;
    }

    .optional-field label {
      font-size: 0.95rem;
      color: var(--text-secondary, #6c757d);
      margin-bottom: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .checkbox-label:hover {
      color: var(--primary, #5e7ce6);
    }
    
    .checkbox-label input {
      width: 18px;
      height: 18px;
      accent-color: var(--primary, #5e7ce6);
    }

    /* Special styling for topic focus field */
    .focus-field input {
      border: 2px solid rgba(94, 124, 230, 0.35);
      background-color: rgba(244, 246, 255, 0.5);
    }
    
    /* Mobile specific styling for checkboxes */
    @media (max-width: 500px) {
      .checkbox-label {
        font-size: 0.8rem;
        gap: 0.25rem;
        padding: 0.2rem 0;
      }
      
      .checkbox-label input {
        width: 14px;
        height: 14px;
      }
      
      .input-group {
        margin-bottom: 0.25rem;
      }
      
      /* Specific styling for checkbox form inputs */
      .input-group:has(input[type="checkbox"]) {
        margin-bottom: 0.1rem;
      }
      
      /* Make text more compact */
      .checkbox-label span {
        line-height: 1.1;
      }
    }
  `;

  constructor() {
    super();
    this.label = '';
    this.name = '';
    this.type = 'text';
    this.placeholder = '';
    this.value = '';
    this.required = false;
    this.disabled = false;
    this.options = [];
    this.hidden = false;
  }

  _handleInput(e) {
    let value;
    if (this.type === 'checkbox') {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    this.value = value;
    
    this.dispatchEvent(new CustomEvent('input-change', {
      detail: {
        name: this.name,
        value: value
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (this.hidden) {
      return html``;
    }

    const isOptional = !this.required && this.label && this.label.includes('optional');
    const containerClass = `input-group ${this.name === 'subject_specification' ? 'focus-field' : ''} ${isOptional ? 'optional-field' : ''}`;

    if (this.type === 'select') {
      return html`
        <div class="${containerClass}">
          <label for="${this.name}">${this.label}</label>
          <select 
            id="${this.name}" 
            name="${this.name}" 
            ?required=${this.required}
            ?disabled=${this.disabled}
            @change=${this._handleInput}
          >
            <option value="">${this.placeholder || 'Select an option...'}</option>
            ${this.options.map(option => html`
              <option value="${option.value}" ?selected=${this.value === option.value}>
                ${option.label}
              </option>
            `)}
          </select>
        </div>
      `;
    } else if (this.type === 'checkbox') {
      return html`
        <div class="${containerClass}">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              id="${this.name}" 
              name="${this.name}"
              ?checked=${this.value}
              ?disabled=${this.disabled}
              @change=${this._handleInput}
            >
            <span>${this.label}</span>
          </label>
        </div>
      `;
    } else {
      return html`
        <div class="${containerClass}">
          <label for="${this.name}">${this.label}</label>
          <input 
            type="${this.type}" 
            id="${this.name}" 
            name="${this.name}" 
            placeholder="${this.placeholder}"
            .value="${this.value}"
            ?required=${this.required}
            ?disabled=${this.disabled}
            @input=${this._handleInput}
          >
        </div>
      `;
    }
  }

  /**
   * Resets the input to its default value
   */
  reset() {
    console.log(`Resetting input ${this.name}`);
    
    if (this.type === 'checkbox') {
      this.value = true; // Default is checked for checkboxes
    } else if (this.type === 'select') {
      this.value = '';
    } else {
      this.value = '';
    }
    
    // Ensure the DOM is updated
    this.requestUpdate();
    
    // If the input element exists in the shadow DOM, update its value directly
    if (this.shadowRoot) {
      const inputElement = this.shadowRoot.querySelector(`#${this.name}`);
      if (inputElement) {
        if (this.type === 'checkbox') {
          inputElement.checked = this.value;
        } else {
          inputElement.value = this.value;
        }
      }
    }
  }
}

// Guard against duplicate registration
if (!customElements.get('form-input-group')) {
  customElements.define('form-input-group', FormInputGroup);
} 