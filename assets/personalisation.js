if (!customElements.get('personalisation-fields')) {
  customElements.define('personalisation-fields', class PersonalisationFields extends HTMLElement {
    connectedCallback() {
      this.form = document.getElementById(this.dataset.formId);
      this.toggle = this.querySelector('.personalisation__toggle');
      this.controls = Array.from(this.querySelectorAll('[data-personalisation-control]'));
      if (!this.form) return;

      // Native constraint validation is what blocks add to cart while a field is invalid.
      this.form.noValidate = false;

      this.onFormData = this.onFormData.bind(this);
      this.onBlockSelect = this.onBlockSelect.bind(this);
      this.form.addEventListener('formdata', this.onFormData);
      document.addEventListener('shopify:block:select', this.onBlockSelect);
      this.toggle.addEventListener('click', () => this.setOpen(!this.hasAttribute('open')));

      this.setMinDates();
      this.controls.forEach((control) => {
        control.addEventListener('invalid', this.onInvalid.bind(this));
        control.addEventListener('input', () => this.onInput(control));
        control.addEventListener('change', () => this.onInput(control));
        control.addEventListener('blur', () => this.onBlur(control));
        this.updateWhitespaceValidity(control);
        this.updateCounter(control);
      });
    }

    disconnectedCallback() {
      if (this.form) this.form.removeEventListener('formdata', this.onFormData);
      document.removeEventListener('shopify:block:select', this.onBlockSelect);
    }

    setOpen(open) {
      this.toggleAttribute('open', open);
      this.toggle.setAttribute('aria-expanded', open);
    }

    // Recalculate the earliest date in the customer's own timezone, as the page may be cached.
    setMinDates() {
      const date = new Date();
      date.setDate(date.getDate() + (Number(this.dataset.minOffset) || 0));
      const min = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
      ].join('-');
      this.controls.filter((control) => control.type === 'date').forEach((control) => control.min = min);
    }

    onInvalid(event) {
      const control = event.target;
      event.preventDefault();
      this.showError(control);

      // Invalid events fire in document order, so the first one in a submit attempt gets focus.
      if (this.focusPending) return;
      this.focusPending = true;
      this.setOpen(true);
      control.focus();
      setTimeout(() => this.focusPending = false);
    }

    // Called by the inline add to cart guard. Invalid controls report through onInvalid.
    validate() {
      this.controls.forEach((control) => this.updateWhitespaceValidity(control));
      return this.controls.filter((control) => !control.checkValidity()).length === 0;
    }

    // Flags bad values (e.g. a malformed email) as soon as the customer leaves a field they have edited.
    onBlur(control) {
      if (!control.dataset.edited && control.getAttribute('aria-invalid') !== 'true') return;
      control.validity.valid ? this.clearError(control) : this.showError(control);
    }

    onInput(control) {
      control.dataset.edited = 'true';
      this.updateWhitespaceValidity(control);
      this.updateCounter(control);
      if (control.getAttribute('aria-invalid') !== 'true') return;
      control.validity.valid ? this.clearError(control) : this.showError(control);
    }

    onFormData(event) {
      this.controls.forEach(({ name, type }) => {
        const value = event.formData.get(name);
        if (type === 'checkbox' || typeof value !== 'string') return;

        const trimmed = value.trim();
        trimmed ? event.formData.set(name, trimmed) : event.formData.delete(name);
      });
    }

    onBlockSelect(event) {
      if (this.contains(event.target) || this === event.target) this.setOpen(true);
    }

    // Textareas don't support `pattern`, so whitespace-only values are rejected here.
    updateWhitespaceValidity(control) {
      if (control.tagName !== 'TEXTAREA' || !control.required) return;
      const isBlank = control.value !== '' && control.value.trim() === '';
      control.setCustomValidity(isBlank ? control.dataset.errorRequired : '');
    }

    updateCounter(control) {
      const counter = document.getElementById(`${control.id}-counter`);
      if (counter) counter.querySelector('[data-personalisation-count]').textContent = control.value.length;
    }

    getErrorMessage(control) {
      const { validity } = control;
      if (validity.valueMissing || validity.customError) return control.dataset.errorRequired;
      if (validity.typeMismatch || validity.patternMismatch) {
        return control.dataset.errorInvalid || control.dataset.errorRequired;
      }
      if (validity.rangeUnderflow) {
        const earliest = new Date(`${control.min}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        return `Please choose ${earliest} or a later date.`;
      }
      return control.validationMessage;
    }

    showError(control) {
      const error = document.getElementById(`${control.id}-error`);
      error.querySelector('[data-personalisation-error-text]').textContent = this.getErrorMessage(control);
      error.hidden = false;
      control.setAttribute('aria-invalid', 'true');
    }

    clearError(control) {
      document.getElementById(`${control.id}-error`).hidden = true;
      control.removeAttribute('aria-invalid');
    }
  });
}
