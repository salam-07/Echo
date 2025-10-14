import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    className,
    size = 'default',
    ...props
}) => {
    const sizes = {
        sm: 'modal-box w-11/12 max-w-md',
        default: 'modal-box w-11/12 max-w-2xl',
        lg: 'modal-box w-11/12 max-w-4xl',
        xl: 'modal-box w-11/12 max-w-6xl'
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open" {...props}>
            <div className={cn(sizes[size], className)}>
                {title && (
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">{title}</h3>
                        <button
                            onClick={onClose}
                            className="btn btn-sm btn-circle btn-ghost"
                            aria-label="Close modal"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {children}
            </div>
            <div className="modal-backdrop" onClick={onClose}>
                <button>close</button>
            </div>
        </div>
    );
};

const ModalHeader = ({ className, children, ...props }) => {
    return (
        <div className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    );
};

const ModalBody = ({ className, children, ...props }) => {
    return (
        <div className={cn('py-4', className)} {...props}>
            {children}
        </div>
    );
};

const ModalFooter = ({ className, children, ...props }) => {
    return (
        <div className={cn('modal-action', className)} {...props}>
            {children}
        </div>
    );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;