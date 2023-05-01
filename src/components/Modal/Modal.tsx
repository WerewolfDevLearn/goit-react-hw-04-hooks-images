import { useEffect } from "react";
import { ModaLProps } from "../interfaces/interfaces";
export default function Modal({ onCloseModal, children }: ModaLProps) {
  const pressEscBtn = (event: KeyboardEvent) => {
    // console.log(event);
    if (event.code === "Escape") {
      onCloseModal();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", pressEscBtn);
    return () => {
      window.removeEventListener("keydown", pressEscBtn);
    };
  }, []);
  const onOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) onCloseModal();
  };

  return (
    <div className='Overlay' onClick={onOverlayClick}>
      <div className='Modal'>{children}</div>
    </div>
  );
}
// onKeyDown={pressEscBtn} tabIndex={0} role='button'
