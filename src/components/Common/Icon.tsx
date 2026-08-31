import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  className?: string;
  size?: number | string;
  fill?: boolean;
  weight?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  className = '',
  size,
  fill = false,
  weight,
  style = {},
  ...props
}) => {
  const customStyles: React.CSSProperties = {
    ...style,
    ...(size ? { fontSize: typeof size === 'number' ? `${size}px` : size, width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size } : {}),
    ...(fill || weight
      ? {
          fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight || 400}, 'GRAD' 0, 'opsz' 24`,
        }
      : {}),
  };

  return (
    <span
      className={`material-symbols-outlined select-none align-middle inline-flex items-center justify-center leading-none ${className}`}
      style={customStyles}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
};

export default Icon;
