"use client";

import React from 'react';
// import { CheckIcon } from '@radix-ui/react-icons';
import { IoCheckmark } from 'react-icons/io5';

interface CheckboxProps {
	id?: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'default' | 'error';
	className?: string;
	children?: React.ReactNode;
}

const Checkbox: React.FC<CheckboxProps> = ({
	id,
	checked,
	onChange,
	label,
	disabled = false,
	size = 'md',
	// variant = 'default',
	className = '',
	children
}) => {
	const sizeClasses = {
		sm: 'w-3 h-3',
		md: 'w-4 h-4',
		lg: 'w-5 h-5'
	};

	const iconSizeClasses = {
		sm: 'w-3 h-3',
		md: 'w-4 h-4',
		lg: 'w-5 h-5'
	};

	const baseClasses = `
		inline-flex items-center justify-center
		rounded-none
		transition-all duration-200 ease-in-out
		cursor-pointer
		focus:outline-none
		${sizeClasses[size]}
	`;

	const variantClasses = ``;

	const checkedClasses = checked
		? `bg-white text-brand-blue border border-brand-blue`
		: `bg-neutral-50 border border-neutral-300`;

	const disabledClasses = disabled
		? `opacity-50 cursor-not-allowed`
		: '';

	const handleClick = () => {
		if (!disabled) {
			onChange(!checked);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			handleClick();
		}
	};

	return (
		<div className={`flex items-center space-x-3  ${className}`}>
			<div
				id={id}
				role="checkbox"
				aria-checked={checked}
				aria-disabled={disabled}
				tabIndex={disabled ? -1 : 0}
				className={`${baseClasses} ${variantClasses} ${checkedClasses} ${disabledClasses}`}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				{checked && (
					<IoCheckmark className={`${iconSizeClasses[size]} transition-opacity duration-200`} />
				)}
			</div>
			{(label || children) && (
				<label
					htmlFor={id}
					className={`font-sans font-normal text-[10px] md:text-[12px] leading-[23px] tracking-[-0.03em] text-[rgba(31,31,31,0.5)] cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''
						}`}
					onClick={handleClick}
				>
					{children || label}
				</label>
			)}
		</div>
	);
};

export default Checkbox;
