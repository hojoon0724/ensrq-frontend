import { Image } from "@/components/atoms";
import { AboutProfilesContainer, Donors } from "@/components/organisms";
import { SectionEmpty } from "@/components/sections";
import { artisticDirectors, enSRQArtists, guestArtists } from "@/data/about-bios";

export default function About() {
  return (
    <div>
      <SectionEmpty themeColor="gray" className="flex flex-col justify-center items-center gap-s">
        <a className="anchor scroll-mt-[80px] lg:scroll-mt-[110px]" id="mission"></a>
        <Image
          src="/graphics/ensrq-logo-for-bright.webp"
          alt="ensrq-logo"
          width={800}
          height={300}
          objectFit="contain"
          className="h-[clamp(300px,40svh,400px)]"
        />
        <div className="about-text flex flex-col gap-double text-pretty items-center max-w-full mb-double">
          <h1 className="museo-slab w-full font-thin mb-triple text-center">
            Human, Inclusive, Excellence, Inspiring, and Current
          </h1>

          <p className="text-pretty text-justify w-[80ch] max-w-full">
            ensembleNEWSRQ strives to manifest the creativity of the current generation and inspire audiences to
            participate in musical culture in a profound way, through high-level curated concert experiences that
            sustain and transform the relevance of contemporary classical music.
          </p>
          <p className="text-pretty text-justify w-[80ch] max-w-full">
            Founded in 2015 by violinist Samantha Bennett and percussionist George Nickson, ensembleNEWSRQ (enSRQ) is a
            versatile chamber music ensemble in Sarasota, FL, dedicated to playing and advocating for the music of
            contemporary composers. Through thoughtfully curated and innovative programs, enSRQ demonstrates how
            contemporary music is a reflection of our world and cultural experience. The ensemble strives to manifest
            the creativity of the current generation and inspire audiences to participate in musical culture in a
            profound way.
          </p>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sky">
        <a className="anchor scroll-mt-[80px]" id="artistic-directors"></a>
        <div className="flex flex-col mb-double w-full justify-center items-center gap-s">
          <h1 className="museo-slab font-thin mb-triple">Artistic Directors</h1>
          <AboutProfilesContainer profilesArray={artisticDirectors} themeColor="sky" backgroundTone="light" />
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sand">
        <a className="anchor scroll-mt-[80px]" id="ensrq-artists"></a>
        <div className="flex flex-col mb-double w-full justify-center items-center gap-s">
          <h1 className="museo-slab font-thin mb-triple">enSRQ Artists</h1>
          <AboutProfilesContainer profilesArray={enSRQArtists} themeColor="sand" backgroundTone="dark" />
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="water">
        <a className="anchor scroll-mt-[80px]" id="guest-artists"></a>
        <div className="flex flex-col mb-double w-full justify-center items-center gap-s">
          <h1 className="museo-slab font-thin mb-triple">Guest Artists</h1>
          <AboutProfilesContainer profilesArray={guestArtists} themeColor="water" 
          backgroundTone="dark" />
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sky">
        <a className="anchor scroll-mt-[80px]" id="contact"></a>
        <div className="flex flex-col mb-double w-full justify-center items-center gap-s">
          <h1 className="museo-slab font-thin mb-triple">Contact Us</h1>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sand">
        <a className="anchor scroll-mt-[80px]" id="board-of-directors"></a>
        <div className="flex flex-col mb-double w-full justify-center items-center gap-s">
          <h1 className="museo-slab font-thin mb-triple">Board of Directors</h1>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="water">
        <a className="anchor scroll-mt-[80px]" id="diversity-policy"></a>
        <div className="flex flex-col mb-double">
          <h1 className="museo-slab font-thin mb-triple">Diversity Policy</h1>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sky" className="m-double">
        <a className="anchor scroll-mt-[80px]" id="our-donors"></a>
        <div className="flex flex-col mb-double">
          <h1 className="museo-slab font-thin mb-triple">Our Donors</h1>
          <Donors />
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sand">
        <a className="anchor scroll-mt-[80px]" id="donate"></a>
        <div className="flex flex-col mb-double">
          <h1 className="museo-slab font-thin mb-triple">Donate</h1>
        </div>
      </SectionEmpty>
    </div>
  );
}
