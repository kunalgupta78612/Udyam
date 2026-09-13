/**
 * Format number as Indian Rupee currency
 * e.g. 300000 → ₹3,00,000
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '₹0';
  
  const num = Number(amount);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(num % 10000000 === 0 ? 0 : 1)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(num % 100000 === 0 ? 0 : 1)} L`;
  }
  
  // Indian number formatting
  const str = num.toString();
  let result = '';
  const parts = str.split('.');
  let intPart = parts[0];
  const decPart = parts[1];
  
  if (intPart.length > 3) {
    result = ',' + intPart.slice(-3);
    intPart = intPart.slice(0, -3);
    while (intPart.length > 2) {
      result = ',' + intPart.slice(-2) + result;
      intPart = intPart.slice(0, -2);
    }
    result = intPart + result;
  } else {
    result = intPart;
  }
  
  return '₹' + result + (decPart ? '.' + decPart : '');
}

/**
 * Parse Indian currency string to number
 */
export function parseCurrency(str) {
  if (!str) return 0;
  return Number(str.replace(/[₹,\s]/g, '')) || 0;
}

export const formatRupees = formatCurrency;
export default formatCurrency;
