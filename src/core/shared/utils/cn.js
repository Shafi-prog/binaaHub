"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.formatCurrency = formatCurrency;

// Utility to combine class names (like clsx or classnames)
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Utility to format currency
function formatCurrency(amount, currency = 'SAR') {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}
