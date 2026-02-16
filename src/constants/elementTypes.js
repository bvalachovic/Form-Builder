export const ELEMENT_TYPES = [
  { type: 'text', label: 'Text Input', icon: 'text_fields' },
  { type: 'email', label: 'Email Input', icon: 'email' },
  { type: 'number', label: 'Number Input', icon: 'pin' },
  { type: 'textarea', label: 'Textarea', icon: 'notes' },
  { type: 'date', label: 'Date Picker', icon: 'calendar_today' },
  { type: 'select', label: 'Select / Dropdown', icon: 'arrow_drop_down_circle' },
  { type: 'radio', label: 'Radio Group', icon: 'radio_button_checked' },
  { type: 'checkbox', label: 'Checkbox Group', icon: 'check_box' },
  { type: 'toggle', label: 'Toggle / Switch', icon: 'toggle_on' }
]

// Field types that require an options array
export const OPTION_TYPES = ['select', 'radio', 'checkbox']

// Which validation rules are applicable per field type
export const VALIDATION_MAP = {
  text: ['required', 'minLength', 'maxLength', 'pattern'],
  email: ['required', 'pattern'],
  number: ['required', 'min', 'max'],
  textarea: ['required', 'minLength', 'maxLength'],
  date: ['required'],
  select: ['required'],
  radio: ['required'],
  checkbox: ['required'],
  toggle: ['required']
}

// Human-readable labels for validation rules
export const VALIDATION_LABELS = {
  required: 'Required',
  minLength: 'Minimum Length',
  maxLength: 'Maximum Length',
  min: 'Minimum Value',
  max: 'Maximum Value',
  pattern: 'Pattern (Regex)'
}

/**
 * Factory function to create a new field instance with defaults.
 * @param {string} type - One of the ELEMENT_TYPES type values
 * @returns {object} A new field object with a unique ID
 */
export function createField (type) {
  const elementDef = ELEMENT_TYPES.find(e => e.type === type)

  return {
    id: crypto.randomUUID(),
    type,
    label: elementDef ? elementDef.label : 'Field',
    placeholder: '',
    options: OPTION_TYPES.includes(type)
      ? [
          { label: 'Option 1', value: 'option_1' },
          { label: 'Option 2', value: 'option_2' }
        ]
      : [],
    validation: {
      required: false,
      minLength: null,
      maxLength: null,
      min: null,
      max: null,
      pattern: null
    },
    errorMessages: {
      required: 'This field is required',
      minLength: 'Must be at least {n} characters',
      maxLength: 'Must be no more than {n} characters',
      min: 'Value must be at least {n}',
      max: 'Value must be at most {n}',
      pattern: 'Invalid format'
    }
  }
}
