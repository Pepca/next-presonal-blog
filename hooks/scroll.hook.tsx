import {useState} from "react";

export const useScroll = () => {
  const [scrollbarCompensation, setScrollbarCompensation] = useState(0)

  const getScrollbarCompensation = (): number => {
    return window.innerWidth - document.body.offsetWidth
  }

  const setScrollbarCompensationState = (value: number): void => {
    setScrollbarCompensation(value)

    document.body.style.setProperty('--scrollbarCompensation', value + 'px')
  }

  const lockBody = () => {
    document.body.classList.add('_lockScroll')
  }

  const unlockBody = () => {
    document.body.classList.remove('_lockScroll')
  }

  const toggleLockBody = (condition: boolean): void => {
    document.body.classList.toggle('_lockScroll', condition)
  }

  return {getScrollbarCompensation, setScrollbarCompensationState, lockBody, unlockBody, toggleLockBody}
}
