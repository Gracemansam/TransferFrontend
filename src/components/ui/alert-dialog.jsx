import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export const AlertDialog = ({ open, onOpenChange, children }) => {
    return (
        <Modal
            isOpen={open}
            onRequestClose={onOpenChange}
            className="alert-dialog-content"
            overlayClassName="alert-dialog-overlay"
        >
            {children}
        </Modal>
    );
};

export const AlertDialogContent = ({ children }) => {
    return (
        <div className="alert-dialog-content">
            {children}
        </div>
    );
};

export const AlertDialogHeader = ({ children }) => {
    return (
        <div className="alert-dialog-header">
            {children}
        </div>
    );
};

export const AlertDialogTitle = ({ children }) => {
    return (
        <h2 className="alert-dialog-title">
            {children}
        </h2>
    );
};

export const AlertDialogDescription = ({ children }) => {
    return (
        <div className="alert-dialog-description">
            {children}
        </div>
    );
};

export const AlertDialogFooter = ({ children }) => {
    return (
        <div className="alert-dialog-footer">
            {children}
        </div>
    );
};

export const AlertDialogCancel = ({ children, onClick }) => {
    return (
        <button onClick={onClick} className="alert-dialog-cancel">
            {children}
        </button>
    );
};
