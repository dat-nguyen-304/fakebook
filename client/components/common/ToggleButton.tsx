import React from 'react';
import cn from 'classnames';

interface ToggleButtonProps {
  enabled: boolean;
  onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ enabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative inline-flex items-center w-12 h-6 transition-all duration-200 ease-in-out rounded-full',
        enabled ? 'bg-blue-500' : 'bg-gray-300'
      )}
    >
      <span
        className={cn(
          'inline-block w-4 h-4 transform transition-all duration-200 ease-in-out bg-white rounded-full',
          enabled ? 'translate-x-7' : 'translate-x-1'
        )}
      />
    </button>
  );
};

export default ToggleButton;
