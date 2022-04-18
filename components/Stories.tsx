import { MouseEventHandler, TouchEventHandler, useEffect } from 'react'

import Image from 'next/image'
import { useState, useCallback, useRef } from 'react'

import { setCurrentDatetime } from '../lib/functions'

// import 'swiper/css'
import styles from '../styles/modules/Stories.module.scss'

import Stories1 from '../public/images/stories1.jpg'
import Stories2 from '../public/images/stories2.jpg'
import Stories3 from '../public/images/stories3.jpg'
import Stories4 from '../public/images/stories4.jpg'

const {
  stories,
  stories__inner,
  stories__track,
  stories__list,
  storiesItem,
  storiesItem__preview,
  storiesItem__text,
  storiesItem__date,
  stories__control,
} = styles

const Stories = () => {
  const [isListDragging, setIsListDragging] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0)
  const [currentListLenght, setCurrentListLenght] = useState(0)

  const startXRef = useRef(0)
  const currentOffsetXRef = useRef(0)

  const storiesTrackRef = useRef<HTMLDivElement | null>(null)

  const slideGap = 25
  const slideWidth = 280 + slideGap
  const listLenght = 8

  const getCurrentEvent = (event: MouseEvent | TouchEvent) => {
    // @ts-ignore
    return event.type.includes('touch') ? event.changedTouches[0] : event
  }

  const getNewOffsetX = useCallback((event: MouseEvent | TouchEvent) => {
    const evt = getCurrentEvent(event)

    return currentOffsetXRef.current - (startXRef.current - evt.clientX)
  }, [])

  const getNewIndexSlide = useCallback(
    (offsetX: number): number => {
      let index = Math.round(-offsetX / slideWidth)

      if (index > currentListLenght) index = currentListLenght
      if (index < 0) index = 0

      return index
    },
    [currentListLenght, slideWidth]
  )

  const swipeAction = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const newOffsetX = getNewOffsetX(event)

      setOffsetX(newOffsetX)
    },
    [getNewOffsetX]
  )

  const swipeEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      setIsListDragging(false)

      const newOffsetX = getNewOffsetX(event)

      const newSlideIndex = getNewIndexSlide(newOffsetX)

      setSlideIndex(newSlideIndex)

      setOffsetX(-(newSlideIndex * slideWidth))

      document.removeEventListener('mousemove', swipeAction)
      document.removeEventListener('mouseup', swipeEnd)
      document.removeEventListener('touchmove', swipeAction)
      document.removeEventListener('touchend', swipeEnd)
    },
    [slideWidth, getNewOffsetX, getNewIndexSlide, swipeAction]
  )

  // @ts-ignore
  const swipeMouseStart: MouseEventHandler | TouchEventHandler = (event) => {
    setIsListDragging(true)

    const evt = getCurrentEvent(event)

    currentOffsetXRef.current = offsetX
    startXRef.current = evt.clientX

    document.addEventListener('mousemove', swipeAction)
    document.addEventListener('mouseup', swipeEnd)
    document.addEventListener('touchmove', swipeAction)
    document.addEventListener('touchend', swipeEnd)
  }

  const nextSlide = () => {
    setOffsetX(-(slideIndex + 1) * slideWidth)

    setSlideIndex((index) => ++index)
  }

  const prevSlide = () => {
    setOffsetX(-(slideIndex - 1) * slideWidth)

    setSlideIndex((index) => --index)
  }

  const changeSliderTrackSizeHandler = useCallback(() => {
    if (storiesTrackRef.current) {
      const currentIndex = Number(
        (storiesTrackRef.current.offsetWidth / slideWidth).toFixed(2)
      )
      const indexThresholdGap = 0.04
      let roundedIndex = Math.round(currentIndex)

      if (currentIndex + indexThresholdGap > roundedIndex) {
        roundedIndex++
      }

      const threshold = Math.abs(
        roundedIndex * slideWidth - storiesTrackRef.current.offsetWidth
      )

      let currentLenght = listLenght - roundedIndex

      if (threshold > slideGap) {
        currentLenght++
      }

      setCurrentListLenght(currentLenght)
    }
  }, [slideWidth])

  useEffect(() => {
    changeSliderTrackSizeHandler()

    window.addEventListener('resize', changeSliderTrackSizeHandler)

    return () =>
      window.removeEventListener('resize', changeSliderTrackSizeHandler)
  }, [changeSliderTrackSizeHandler])

  return (
    <div className={stories}>
      <div className={stories__inner}>
        <div
          className={stories__track}
          ref={storiesTrackRef}
          // @ts-ignore
          onMouseDown={swipeMouseStart}
          // @ts-ignore
          onTouchStart={swipeMouseStart}
        >
          <ul
            className={stories__list}
            style={{
              transform: `translateX(${offsetX}px)`,
              transitionDuration: !isListDragging ? '400ms' : '0ms',
            }}
          >
            <li className={storiesItem}>
              <div className={storiesItem__preview}>
                <Image
                  src={Stories1}
                  alt='storie preview picture'
                  layout='responsive'
                  priority
                  draggable={false}
                />
              </div>
              <div className={storiesItem__text}>Отдыхаю на природе</div>
              <div className={storiesItem__date}>
                <time dateTime={setCurrentDatetime('21.09.2020')}>
                  21.09.2020
                </time>
              </div>
            </li>
            <li className={storiesItem}>
              <div className={storiesItem__preview}>
                <Image
                  src={Stories2}
                  alt='storie preview picture'
                  layout='responsive'
                  priority
                  draggable={false}
                />
              </div>
              <div className={storiesItem__text}>Заканчиваю сложный проект</div>
              <div className={storiesItem__date}>
                <time dateTime={setCurrentDatetime('15.09.2020')}>
                  15.09.2020
                </time>
              </div>
            </li>
            <li className={storiesItem}>
              <div className={storiesItem__preview}>
                <Image
                  src={Stories3}
                  alt='storie preview picture'
                  layout='responsive'
                  priority
                  draggable={false}
                />
              </div>
              <div className={storiesItem__text}>Переехал в новую квартиру</div>
              <div className={storiesItem__date}>
                <time dateTime={setCurrentDatetime('11.09.2020')}>
                  11.09.2020
                </time>
              </div>
            </li>
            <li className={storiesItem}>
              <div className={storiesItem__preview}>
                <Image
                  src={Stories4}
                  alt='storie preview picture'
                  layout='responsive'
                  priority
                  draggable={false}
                />
              </div>
              <div className={storiesItem__text}>Осень пришла!</div>
              <div className={storiesItem__date}>
                <time dateTime={setCurrentDatetime('28.08.2020')}>
                  28.08.2020
                </time>
              </div>
            </li>
            <li className={storiesItem}>
              <div className={storiesItem__preview}>
                <Image
                  src={Stories1}
                  alt='storie preview picture'
                  layout='responsive'
                  priority
                  draggable={false}
                />
              </div>
              <div className={storiesItem__text}>Отдыхаю на природе</div>
              <div className={storiesItem__date}>
                <time dateTime={setCurrentDatetime('21.09.2020')}>
                  21.09.2020
                </time>
              </div>
            </li>
            <li className={storiesItem}>
              <div className={storiesItem__preview}>
                <Image
                  src={Stories2}
                  alt='storie preview picture'
                  layout='responsive'
                  priority
                  draggable={false}
                />
              </div>
              <div className={storiesItem__text}>Заканчиваю сложный проект</div>
              <div className={storiesItem__date}>
                <time dateTime={setCurrentDatetime('15.09.2020')}>
                  15.09.2020
                </time>
              </div>
            </li>
            <li className={storiesItem}>
              <div className={storiesItem__preview}>
                <Image
                  src={Stories3}
                  alt='storie preview picture'
                  layout='responsive'
                  priority
                  draggable={false}
                />
              </div>
              <div className={storiesItem__text}>Переехал в новую квартиру</div>
              <div className={storiesItem__date}>
                <time dateTime={setCurrentDatetime('11.09.2020')}>
                  11.09.2020
                </time>
              </div>
            </li>
            <li className={storiesItem}>
              <div className={storiesItem__preview}>
                <Image
                  src={Stories4}
                  alt='storie preview picture'
                  layout='responsive'
                  priority
                  draggable={false}
                />
              </div>
              <div className={storiesItem__text}>Осень пришла!</div>
              <div className={storiesItem__date}>
                <time dateTime={setCurrentDatetime('28.08.2020')}>
                  28.08.2020
                </time>
              </div>
            </li>
          </ul>
        </div>

        <div className={stories__control}>
          <button
            type={'button'}
            onClick={prevSlide}
            disabled={slideIndex <= 0}
          >
            <svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
              <title />
              <g data-name='Layer 2' id='Layer_2'>
                <path d='M10.1,23a1,1,0,0,0,0-1.41L5.5,17H29.05a1,1,0,0,0,0-2H5.53l4.57-4.57A1,1,0,0,0,8.68,9L2.32,15.37a.9.9,0,0,0,0,1.27L8.68,23A1,1,0,0,0,10.1,23Z' />
              </g>
            </svg>
          </button>
          <button
            type={'button'}
            onClick={nextSlide}
            disabled={slideIndex >= currentListLenght}
          >
            <svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
              <title />
              <g data-name='Layer 2' id='Layer_2'>
                <path d='M10.1,23a1,1,0,0,0,0-1.41L5.5,17H29.05a1,1,0,0,0,0-2H5.53l4.57-4.57A1,1,0,0,0,8.68,9L2.32,15.37a.9.9,0,0,0,0,1.27L8.68,23A1,1,0,0,0,10.1,23Z' />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Stories
