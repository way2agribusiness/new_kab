const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_LIMIT: 10,
};

const USER_TYPES = {
    ADMIN: 'admin',
    USER: 'user',
};

const HELPERS = {
    responseHelper: {
        createSuccessResponse: (message, locale) => ({
            status: 'success',
            message,
            locale,
        }),
        createErrorResponse: (message, errorType) => ({
            status: 'error',
            message,
            errorType,
        }),
    },
};

const MESSAGES = {
    NEWS: {
        NEWS_LIST_FETCHED_SUCCESSFULLY: 'News list fetched successfully.',
    },
    PRODUCTS: {
        NO_PRODUCTS_FOUND: 'No products found for the given criteria.',
    },
};

const ERROR_TYPES = {
    SOMETHING_WENT_WRONG: 'SOMETHING_WENT_WRONG',
};

// utils/constants.js
const constants = { 
    PAGINATION, 
    USER_TYPES, 
    HELPERS, 
    MESSAGES, 
    ERROR_TYPES 
};

export default constants;

