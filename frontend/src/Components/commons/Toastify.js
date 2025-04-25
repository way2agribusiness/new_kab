import React from 'react';

const Toast = ({ type, title, message, onClose }) => {
    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'info':
                return 'bg-warning text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getTypeStylesText = () => {
        switch (type) {
            case 'success':
                return 'text-success';
            case 'error':
                return 'text-danger';
            case 'info':
                return 'text-warning';
            default:
                return 'text-primary';
        }
    };


      const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'info':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0 0V8m0 4h0M4 12a8 8 0 1116 0A8 8 0 014 12z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`flex items-center rounded shadow-md overflow-hidden w-94 relative bg-white dark:bg-boxdark-2 ${getTypeStylesText()}`}>
            {/* <div className={`self-stretch flex items-center px-6 flex-shrink-0 bg-gray-700 dark:bg-gray-300 ${getTypeStyles()}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-8 w-8">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div> */}
            <div className={`self-stretch flex items-center px-6 flex-shrink-0 ${getTypeStyles()}`}>
                {getIcon()}
            </div>
            <div className="p-2 flex-1">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-600">{message}</p>
            </div>
            <button class="absolute top-2 right-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 p-2 rounded cursor-pointer">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    );
};

export default Toast;