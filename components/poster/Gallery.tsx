import React from "react";
import Image from "next/image";

// 1. Define the type for your poster data
interface PosterData {
  image: string;
  posterImage: string;
}

// 2. Define the props for the GalleryCard component
interface GalleryCardProps {
  image: string;
  posterImage: string;
  index: number;
}

// Add your actual image paths here
const samplePosters: PosterData[] = [
  {
    image: "https://ik.imagekit.io/r8pra5q2fr/sample/1.webp",
    posterImage:
      "https://ik.imagekit.io/r8pra5q2fr/posters/poster_6572fa67-a50a-48b4-b6e3-e5a4195543c2_5Ku1ylIms.png",
  },
  {
    image: "https://ik.imagekit.io/r8pra5q2fr/sample/2.webp",
    posterImage:
      "https://ik.imagekit.io/r8pra5q2fr/posters/poster_8665a8fd-1f2f-44ee-922e-2556b1c45c8a_Ty-fwOMZO.png",
  },
  {
    image: "https://ik.imagekit.io/r8pra5q2fr/sample/3.jpg",
    posterImage:
      "https://ik.imagekit.io/r8pra5q2fr/posters/poster_95586380-c575-4afb-bd9d-968a6cc8306d_gkBavketR.png",
  },
  {
    image: "https://ik.imagekit.io/r8pra5q2fr/sample/4.jpeg",
    posterImage:
      "https://ik.imagekit.io/r8pra5q2fr/posters/poster_45750a1d-f676-4847-8d2e-7702218803ed_g2-ESrEnU.png",
  },
  {
    image: "https://ik.imagekit.io/r8pra5q2fr/sample/5.jpg",
    posterImage:
      "https://ik.imagekit.io/r8pra5q2fr/posters/poster_c87b8cd5-046d-4788-8e1a-73d1791316e8_sefON9HAB.png",
  },
  {
    image: "https://ik.imagekit.io/r8pra5q2fr/sample/6.webp",
    posterImage:
      "https://ik.imagekit.io/r8pra5q2fr/posters/poster_206df457-54fa-4cd3-b18e-08d59bccb7c3_ER3BpMSHm6.png",
  },
  {
    image: "https://ik.imagekit.io/r8pra5q2fr/sample/7.webp",
    posterImage:
      "https://ik.imagekit.io/r8pra5q2fr/posters/poster_049f78aa-e101-4f8c-8178-697807045b8d_qNRx0PL-8.png",
  },
  {
    image: "https://ik.imagekit.io/r8pra5q2fr/sample/8.jpeg",
    posterImage:
      "https://ik.imagekit.io/r8pra5q2fr/posters/poster_07305f7b-1c8a-47bd-b2a1-3f9bc266c35b_t0v-ESl5Q.png",
  },
  {
    image: "https://ik.imagekit.io/r8pra5q2fr/sample/9.jpg",
    posterImage:
      "https://ik.imagekit.io/r8pra5q2fr/posters/poster_c9f20cc7-4107-4004-8828-eb8816291837_8OWt3bIkt.png",
  },
  {
    image: "https://ik.imagekit.io/r8pra5q2fr/sample/10.webp",
    posterImage:
      "https://ik.imagekit.io/r8pra5q2fr/posters/poster_446b3576-6540-430a-a5d2-2fac68d8f250_pNOBMMebQ.png",
  },
];

const GalleryCard: React.FC<GalleryCardProps> = ({
  image,
  posterImage,
  index,
}) => {
  return (
    <figure className="w-52 h-[320px] lg:w-64 lg:h-[372px] border-4 border-black  mx-3 lg:mx-6 relative rounded-md overflow-hidden shrink-0">
      {/* Main Poster Image */}
      {/* Container widths: w-52 = 208px, lg:w-64 = 256px */}
      <Image
        src={posterImage}
        alt={`Bounty poster transformation for customer ${index + 1}`}
        fill
        className="object-cover object-center"
        sizes="(max-width: 1024px) 208px, 256px"
      />

      {/* Bottom Left Selfie */}
      {/* Container widths: w-24 = 96px, lg:w-32 = 128px */}
      <div className="w-24 h-32 lg:w-32 lg:h-40 absolute rounded-tr-md bottom-0 left-0 shadow-sm overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={`Original customer selfie input ${index + 1}`}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 96px, 128px"
          />
        </div>
      </div>
    </figure>
  );
};

const Gallery: React.FC = () => {
  return (
    <section id="gallery" className="flex flex-col items-center w-full justify-center bg-[#E6E4D5] border-b-8 border-black shrink-0 py-20 lg:py-32 overflow-hidden">
      <header className="flex flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="bg-gray-200 border-2 border-black rounded-full px-4 py-1.5 font-bold shadow-lg text-sm uppercase">
          Our Works
        </span>
        <h2 className="text-4xl lg:text-6xl font-bold m-0">Gallery</h2>
        <p className="text-lg font-medium text-gray-600 mt-2 text-balance">
          See how ordinary selfies transform into legendary bounties.
        </p>
      </header>

      {/* Row 1 */}
      <div className="w-full h-fit overflow-hidden mt-16 lg:mt-24">
        <div className="flex w-fit h-fit animate-marquee hover:[animation-play-state:paused]">
          <div className="flex shrink-0">
            {samplePosters.map((item, i) => (
              <GalleryCard
                key={`batch1-${i}`}
                image={item.image}
                posterImage={item.posterImage}
                index={i}
              />
            ))}
          </div>
          <div className="flex shrink-0" aria-hidden="true">
            {samplePosters.map((item, i) => (
              <GalleryCard
                key={`batch2-${i}`}
                image={item.image}
                posterImage={item.posterImage}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="w-full overflow-hidden mt-8 lg:mt-12">
        <div className="flex w-fit animate-marquee_reverse hover:[animation-play-state:paused]">
          <div className="flex shrink-0">
            {samplePosters.map((item, i) => (
              <GalleryCard
                key={`batch3-${i}`}
                image={item.image}
                posterImage={item.posterImage}
                index={i}
              />
            ))}
          </div>
          <div className="flex shrink-0" aria-hidden="true">
            {samplePosters.map((item, i) => (
              <GalleryCard
                key={`batch4-${i}`}
                image={item.image}
                posterImage={item.posterImage}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
