import { useCallback, useEffect, useRef } from 'react';
import { ModaLProps } from '../interfaces/interfaces';
export default function Modal({ onCloseModal, children }: ModaLProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const pressEscBtn = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // console.log(event);
    if (event.code === 'Escape') {
      onCloseModal();
    }
  };
  useEffect(() => {
    if (overlayRef.current) {
      const currentOverlayRef = overlayRef.current;
      currentOverlayRef.addEventListener('keydown', pressEscBtn);
      return () => {
        currentOverlayRef.removeEventListener('keydown', pressEscBtn);
      };
    }
  }, [pressEscBtn]);
  const onOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) onCloseModal();
  };
  return (
    <div
      className='Overlay'
      onClick={onOverlayClick}
      onKeyDown={pressEscBtn}
      role='button'
      tabIndex={0}
      ref={overlayRef}
    >
      <div className='Modal'>{children}</div>
    </div>
  );
}
// onKeyDown={pressEscBtn} tabIndex={0} role='button'
