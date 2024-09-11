import { useOpenModal } from '@hooks/client/useOpenModal';
import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { RxCross1 } from 'react-icons/rx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { onModalOpen, onModalClose } = useOpenModal();

  useEffect(() => {
    if (isOpen) {
      onModalOpen();
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '16px';
    } else {
      onModalClose();
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      onModalClose();
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed top-0 left-0 right-0 bottom-0 modal bg-black bg-opacity-70 flex justify-center items-center z-[200]">
      <div ref={modalRef} className="bg-[#252728] rounded-lg shadow-border w-[700px] relative">
        <div className="flex items-center py-4 shadow-border-b">
          <div className="w-[48px]" />
          <h2 className="flex-grow text-center text-[20px] font-bold text-[#e2e5e9]">{title}</h2>
          <div className="w-[48px] flex justify-start">
            <button
              onClick={onClose}
              className="flex justify-center items-center w-[36px] h-[36px] bg-[#3b3d3e] hover:bg-[#505153] rounded-full"
            >
              <RxCross1 color="#a0a3a6" />
            </button>
          </div>
        </div>
        <div className="p-4 max-h-[480px] overflow-y-auto">{children}</div>
        <div className="p-4 shadow-border-t">{footer}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
