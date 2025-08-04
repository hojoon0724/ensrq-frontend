import { Image } from "@/components/atoms";
import { SectionEmpty } from "@/components/sections";
import donorsList from "@/data/donors.json";

export default function About() {
  return (
    <div>
      <SectionEmpty themeColor="gray" className="m-double flex flex-col justify-center items-center gap-s">
        <a className="anchor" id="mission" />
        <Image src="/graphics/ensrq-logo-for-bright.png" alt="ensrq-logo" width={800} height={300} />
        <div className="about-text flex flex-col gap-double text-pretty items-center">
          <h1 className="museo-slab w-full font-thin mb-triple text-center">
            Human, Inclusive, Excellence, Inspiring, and Current
          </h1>

          <p className="text-pretty text-justify w-[80ch]">
            ensembleNEWSRQ strives to manifest the creativity of the current generation and inspire audiences to
            participate in musical culture in a profound way, through high-level curated concert experiences that
            sustain and transform the relevance of contemporary classical music.
          </p>
          <p className="text-pretty text-justify w-[80ch]">
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
        <a className="anchor" id="artistic-directors" />
        <div className="flex flex-col min-h-[20svh]">
          <h1 className="museo-slab font-thin mb-triple">Artistic Directors</h1>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sand">
        <a className="anchor" id="ensrq-artists" />
        <div className="flex flex-col min-h-[20svh]">
          <h1 className="museo-slab font-thin mb-triple">enSRQ Artists</h1>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="water">
        <a className="anchor" id="guest-artists" />
        <div className="flex flex-col min-h-[20svh]">
          <h1 className="museo-slab font-thin mb-triple">Guest Artists</h1>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sky">
        <a className="anchor" id="contact" />
        <div className="flex flex-col min-h-[20svh]">
          <h1 className="museo-slab font-thin mb-triple">Contact Us</h1>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sand">
        <a className="anchor" id="board-of-directors" />
        <div className="flex flex-col min-h-[20svh]">
          <h1 className="museo-slab font-thin mb-triple">Board of Directors</h1>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="water">
        <a className="anchor" id="diversity-policy" />
        <div className="flex flex-col min-h-[20svh]">
          <h1 className="museo-slab font-thin mb-triple">Diversity Policy</h1>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sky" className="m-double">
        <a className="anchor" id="our-donors" />
        <div className="flex flex-col min-h-[20svh]">
          <h1 className="museo-slab font-thin mb-triple">Our Donors</h1>
          <div className="donors-container flex flex-col gap-triple">
            {donorsList.map((tiers, index) => (
              <div key={index} className="tiers-item flex flex-col gap-s">
                <h2 className="museo-slab font-medium">{tiers.amount}</h2>
                <ul
                  className={`${index < 3 ? "columns-1 md:columns-2 leading-none text-lg" : "columns-2 md:columns-3 lg:columns-4 text-sm"}`}
                >
                  {tiers.donors.map((donor, donorIndex) => (
                    <li className={`pl-4 [text-indent:-1rem] ${index < 3 ? "mb-half" : ""}`} key={donorIndex}>
                      {donor}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sand">
        <a className="anchor" id="donate" />
        <div className="flex flex-col min-h-[20svh]">
          <h1 className="museo-slab font-thin mb-triple">Donate</h1>
        </div>
      </SectionEmpty>
    </div>
  );
}
