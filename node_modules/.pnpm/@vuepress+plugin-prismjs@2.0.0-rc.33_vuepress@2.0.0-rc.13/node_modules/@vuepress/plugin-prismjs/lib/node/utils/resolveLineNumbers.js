/**
 * Resolve the `:line-numbers` / `:no-line-numbers` mark from token info
 */
export const resolveLineNumbers = (info) => {
    if (/:line-numbers\b/.test(info)) {
        return true;
    }
    if (/:no-line-numbers\b/.test(info)) {
        return false;
    }
    return null;
};
