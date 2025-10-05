"use client";
import React, { useRef } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useAutoplay } from "./EmblaCarouselAutoplay";
import { useAutoplayProgress } from "./EmblaCarouselAutoplayProgress";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import "./embla.css";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  imgUrl: string;
  fullName: string;
  heroDescription: string;
  _id: string;
}

type PropType = {
  slides: Slide[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const progressNode = useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay({ playOnInit: true, delay: 5000 }),
  ]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } =
    useAutoplay(emblaApi);

  const { showAutoplayProgress } = useAutoplayProgress(emblaApi, progressNode);

  return (
    <div className="embla relative group">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container ">
          {slides.map((slide, i) => (
            <div className="embla__slide" key={i}>
              <div className="embla__slide__number relative ">
                <Image
                  alt={slide.fullName}
                  src={slide.imgUrl}
                  fill
                  className="object-cover"
                />
                <div className="w-full h-full absolute top-0 right-0 bg-black/30 flex flex-col items-center justify-end text-white">
                  <div className="flex max-lg:flex-col p-5 max-lg:gap-4 lg:p-8 w-full lg:items-center justify-between">
                    <div className="flex items-start justify-center flex-col gap-4 lg:w-[70%]">
                      <p className="text-xl lg:text-4xl font-bold m-0 capitalize">
                        {slide.fullName}
                      </p>
                      <p className="text-sm lg:text-lg m-0">
                        {slide.heroDescription}
                      </p>
                    </div>
                    <Link
                      href={`/personality/${slide.fullName
                        .replaceAll(" ", "-")
                        .replaceAll(".", "")}`}
                      className="bg-black text-white text-lg font-bold lg:mt-4 px-4 lg:text-lg w-fit rounded-lg lg:px-8"
                    >
                      <h2>Chat</h2>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`embla__progress w-full`.concat(
          showAutoplayProgress ? "" : " embla__progress--hidden "
        )}
      >
        <div className="embla__progress__bar" ref={progressNode} />
      </div>
      <div className="absolute top-0 right-0 w-full hidden group-hover:flex p-6 items-center justify-between">
        <PrevButton
          onClick={() => onAutoplayButtonClick(onPrevButtonClick)}
          disabled={prevBtnDisabled}
        />
        <NextButton
          onClick={() => onAutoplayButtonClick(onNextButtonClick)}
          disabled={nextBtnDisabled}
        />
      </div>
    </div>
  );
};

export default EmblaCarousel;
