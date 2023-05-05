import { useCallback, useRef, useEffect } from 'react';
import { ModaLProps } from '../interfaces/interfaces';
export default function Modal({ onCloseModal, children }: ModaLProps) {
  const overlayRef = useRef<HTMLHeadingElement>(null);
  const pressEscBtn = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      console.log(event);
      if (event.code === 'Escape') {
        onCloseModal();
      }
    },
    [onCloseModal],
  );
  const onOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) onCloseModal();
  };
  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

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
// useEffect(() => {
//   window.addEventListener('keydown', (e) => pressEscBtn(e));
//   return () => {
//     window.removeEventListener('keydown', pressEscBtn);
//   };
// }, [pressEscBtn]);
