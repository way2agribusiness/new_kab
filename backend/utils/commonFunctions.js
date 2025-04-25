const commonFunctions = {};

commonFunctions.getPaginationResponse = (paginationData) => {
    const { count, pageNo, pageLimit, rows } = paginationData;

    const paginationResponse = {
        pagination: {
            currentPage: pageNo,
            pageLimit: pageLimit,
            totalPages: Math.ceil(count / pageLimit),
            totalItems: count,
        },
        data: rows,
    };

    return paginationResponse;
};
export default commonFunctions;