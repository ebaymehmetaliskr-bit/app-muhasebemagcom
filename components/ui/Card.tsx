import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    titleIcon?: React.ReactNode;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, titleIcon, onClick }) => {
    const clickableClass = onClick ? 'cursor-pointer' : '';
    return (
        <div className={`bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-6 shadow-lg ${className} ${clickableClass}`} onClick={onClick}>
            {title && (
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                    {titleIcon}
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};