import React, { useRef, useEffect } from 'react';

interface ModalWrapperProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, onClose, isOpen, triggerRef }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      )
        onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, triggerRef]);

  if (!isOpen) return null;
  return <div ref={wrapperRef}>{children}</div>;
};

export default ModalWrapper;
