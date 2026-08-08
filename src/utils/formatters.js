/**
 * Format a number as currency with 2 decimal places and thousand separators
 * @param {number|string} x - The amount to format
 * @returns {string} Formatted currency string
 * 
 * Examples:
 *   money(1234.5)     => "1,234.50"
 *   money(0)          => "0.00"
 *   money(null)       => "-"
 *   money(undefined)  => "-"
 */
export function money(x) {
  if (x === undefined || x === null) return "-"
  const num = parseFloat(x)
  if (isNaN(num)) return "-"
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Fbu"
}

/**
 * Format a date string or Date object to short date and time
 * @param {string|Date} x - The date to format
 * @returns {string} Formatted date/time string
 * 
 * Examples:
 *   datetime('2024-12-25T14:30:00') => "25/12/2024, 14:30"
 *   datetime(null)                  => "-"
 */
export function datetime(x) {
  if (!x) return "-"
  const date = new Date(x)
  if (isNaN(date.getTime())) return "-"
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

/**
 * Format a date string or Date object to date only (no time)
 * @param {string|Date} x - The date to format
 * @returns {string} Formatted date string
 * 
 * Examples:
 *   dateOnly('2024-12-25') => "25/12/2024"
 */
export function dateOnly(x) {
  if (!x) return "-"
  const date = new Date(x)
  if (isNaN(date.getTime())) return "-"
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short'
  }).format(date)
}

/**
 * Format a date string or Date object to time only
 * @param {string|Date} x - The date to format
 * @returns {string} Formatted time string
 */
export function timeOnly(x) {
  if (!x) return "-"
  const date = new Date(x)
  if (isNaN(date.getTime())) return "-"
  return new Intl.DateTimeFormat('en-GB', {
    timeStyle: 'short'
  }).format(date)
}

/**
 * Format a number as percentage
 * @param {number} x - The value (0-100 or 0-1)
 * @param {boolean} isDecimal - If true, x is decimal (0.15 = 15%)
 * @returns {string} Formatted percentage
 * 
 * Examples:
 *   percentage(42.5)      => "42.50%"
 *   percentage(0.15, true) => "15.00%"
 */
export function percentage(x, isDecimal = false) {
  if (x === undefined || x === null) return "-"
  const num = isDecimal ? parseFloat(x) * 100 : parseFloat(x)
  if (isNaN(num)) return "-"
  return num.toFixed(2) + '%'
}

/**
 * Format a number with thousand separators (no decimals)
 * @param {number} x - The number to format
 * @returns {string} Formatted number
 * 
 * Examples:
 *   number(1234567) => "1,234,567"
 */
export function number(x) {
  if (x === undefined || x === null) return "-"
  const num = parseInt(x)
  if (isNaN(num)) return "-"
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Truncate text to a maximum length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum characters
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 50) {
  if (!text) return "-"
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Format stock status with color indicator
 * @param {number} quantity - Current stock
 * @param {number} reorderLevel - Reorder threshold
 * @returns {object} { text, class }
 */
export function stockStatus(quantity, reorderLevel) {
  if (quantity === 0) return { text: 'Out of Stock', class: 'out' }
  if (quantity <= reorderLevel) return { text: 'Low Stock', class: 'low' }
  return { text: 'In Stock', class: 'in' }
}