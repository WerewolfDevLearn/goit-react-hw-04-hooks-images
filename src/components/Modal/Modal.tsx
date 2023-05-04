import { useCallback, useEffect } from 'react';
import { ModaLProps } from '../interfaces/interfaces';
export default function Modal({ onCloseModal, children }: ModaLProps) {
  const pressEscBtn = useCallback(
    (event: KeyboardEvent) => {
      // console.log(event);
      if (event.code === 'Escape') {
        onCloseModal();
      }
    },
    [onCloseModal],
  );
  useEffect(() => {
    window.addEventListener('keydown', (e) => pressEscBtn(e));
    return () => {
      window.removeEventListener('keydown', pressEscBtn);
    };
  }, [pressEscBtn]);
  const onOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) onCloseModal();
  };
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className='Overlay'
      onClick={onOverlayClick}
      // onKeyDown={pressEscBtn}
      // role='button'
      // tabIndex={0}
      // ref={overlayRef}
    >
      <div className='Modal'>{children}</div>
    </div>
  );
}
// onKeyDown={pressEscBtn} tabIndex={0} role='button'
