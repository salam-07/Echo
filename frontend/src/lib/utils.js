// Utility function for conditionally joining classNames
export const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};