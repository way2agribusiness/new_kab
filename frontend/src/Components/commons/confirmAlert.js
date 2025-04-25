import React from 'react';

const ConfirmAlert = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-boxdark-2 p-6 rounded-lg shadow-lg">
                <p className="text-lg mb-4">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-slate-200 rounded-lg mr-2 hover:bg-slate-100 dark:bg-boxdark dark:hover:bg-slate-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAlert;
