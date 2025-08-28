import { Button, Image } from "@/components/atoms";
import { ContactForm } from "@/components/molecules/ContactForm";
import { AboutProfilesContainer, Donors } from "@/components/organisms";
import { SectionEmpty } from "@/components/sections";
import { artisticDirectors, donationLink, enSRQArtists, guestArtists, sponsors } from "@/data/about-data";
import { boardRoster } from "@/data/board-roster";
import { BoardRoster } from "@/types";
import Link from "next/link";

function BoardLabelAndList({ rosterItem }: BoardRoster) {
  return (
    <div className={`${rosterItem.id} flex flex-col justify-start items-start gap-s`}>
      <h3>{rosterItem.label}</h3>
      <ul className={`grid gap-x-12 ${rosterItem.list.length < 5 ? "grid-cols-1" : "grid-cols-2"}`}>
        {rosterItem.list.map((item, index) => (
          <li key={index} className={`name ${rosterItem.list.length < 5 ? "text-lg" : "text-base"}`}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

const diversityPolicyText = [
  `ensembleNEWSRQ recognizes that in order to fulfill its mission and sustain its values it must embrace diversity in all of its activities.`,

  `The current generation of contemporary classical music creators, whether composers, performers or both, is an increasingly diverse body with the highest standards of excellence. We are inspired by and want to contribute to the development of the art that this diverse group is driving.`,

  `We will continue to seek diversity in the composers, performers, staff and board members whose efforts together support the quality, focus and artistic growth that are essential to our mission and values.`,

  `We believe in treating all people with respect and dignity and strive to create and foster a supportive and understanding environment in which all individuals realize their maximum potential within the organization, regardless of their differences. We welcome input and participation from people of different ethnicities, genders and gender expressions, languages, ages, sexual orientations, religions, socio-economic statuses, physical and mental abilities, thinking styles, experiences, and education.`,

  `We believe organizational diversity brings a wide array of perspectives to bear on the innovative and creative efforts as well as the pragmatic, behind-the-scenes activities of the organization, resulting in artistically vibrant and culturally relevant performances and community engagement.`,

  `We believe diversity is best sustained when it is an on-going, explicit organizational focus. To that end, we will continue to have intentional discussion and open conversation among artistic director(s), board members, staff, and musicians, to evaluate how we are sustaining the diversity this policy calls for and what additional actions we need to pursue.`,
];

export default function About() {
  return (
    <div>
      <SectionEmpty themeColor="gray" className="flex flex-col justify-center items-center gap-s relative">
        <a className="anchor scroll-mt-[80px] lg:scroll-mt-[110px]" id="mission"></a>
        <Image
          src="/graphics/ensrq-logo-for-bright.webp"
          alt="ensrq-logo"
          width={800}
          height={300}
          fill={false}
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
          <h1 className="museo-slab font-thin mb-double">Artistic Directors</h1>
          <AboutProfilesContainer profilesArray={artisticDirectors} themeColor="sky" backgroundTone="light" />
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sand">
        <a className="anchor scroll-mt-[80px]" id="ensrq-artists"></a>
        <div className="flex flex-col mb-double w-full justify-center items-center gap-s">
          <h1 className="museo-slab font-thin mb-double">enSRQ Artists</h1>
          <AboutProfilesContainer profilesArray={enSRQArtists} themeColor="sand" backgroundTone="dark" />
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="water">
        <a className="anchor scroll-mt-[80px]" id="guest-artists"></a>
        <div className="flex flex-col mb-double w-full justify-center items-center gap-s">
          <h1 className="museo-slab font-thin mb-double">Guest Artists</h1>
          <AboutProfilesContainer profilesArray={guestArtists} themeColor="water" backgroundTone="dark" />
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sky">
        <a className="anchor scroll-mt-[80px]" id="contact"></a>
        <div className="flex flex-col mb-double w-full justify-center items-center gap-s">
          <h1 className="museo-slab font-thin mb-double">Contact Us</h1>
          <div className="w-full flex flex-col justify-center items-center">
            <ContactForm brandColorTheme="sky" />
          </div>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sand">
        <a className="anchor scroll-mt-[80px]" id="board-of-directors"></a>
        <div className="flex flex-col md:flex-row mb-double justify-center items-start gap-x-24 gap-y-12 h-full">
          <div className="col-1 h-full flex flex-col gap-12 justify-between">
            <BoardLabelAndList rosterItem={boardRoster.boardOfDirectors} />
            <BoardLabelAndList rosterItem={boardRoster.artisticLeadership} />
          </div>
          <div className="col-2 h-full flex flex-col gap-12 justify-between">
            <BoardLabelAndList rosterItem={boardRoster.members} />
          </div>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="water">
        <a className="anchor scroll-mt-[80px]" id="diversity-policy"></a>
        <div className="flex flex-col mb-double justify-center gap-double">
          <div className="header-container">
            <h1 className="museo-slab font-thin mb-double text-center">Diversity Policy</h1>
            <h5 className="text-center">A Statement of Diversity, Equity, and Inclusivity</h5>
          </div>
          <div className="paragraph-container">
            {diversityPolicyText.map((paragraph, index) => (
              <p key={index} className="mb-s leading-normal text-pretty text-justify">
                {paragraph}
              </p>
            ))}
            <div className="text-right">Adopted September 14, 2021</div>
          </div>
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sky">
        <a className="anchor scroll-mt-[80px]" id="sponsors"></a>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-s w-[clamp(320px,100%,600px)] lg:w-full h-full">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className={`relative flex justify-center items-center w-full h-full aspect-[18/17] ${sponsor.background ? "bg-white" : ""}`}
            >
              <Image
                src={`/graphics/logos/${sponsor.logoFileName}`}
                alt={sponsor.name}
                objectFit="contain"
                className={sponsor.padding === true ? "p-double" : "p-0"}
              />
            </div>
          ))}
        </div>
      </SectionEmpty>
      <SectionEmpty themeColor="sky">
        <a className="anchor scroll-mt-[80px]" id="our-donors"></a>
        <div className="flex flex-col mb-double">
          <h1 className="museo-slab font-thin mb-double">Our Donors</h1>
          <Donors />
        </div>
      </SectionEmpty>

      <SectionEmpty themeColor="sand">
        <a className="anchor scroll-mt-[80px]" id="donate"></a>
        <div className="flex flex-col mb-s justify-between items-center">
          <h1 className="museo-slab font-thin mb-double">Donate</h1>
          <div className="flex flex-col justify-center items-center gap-s">
            <h4>If you are a fan of world class performance...</h4>
            <p className="leading-tight text-center">{`Please consider including our 501(c)3 corporation in your charitable giving plans! Without the generosity of musical friends like yourself, we would not be able to keep our dedication focused solely on the enrichment and education of our community by providing the profound and soul nourishing music that we always strive for.`}</p>
            <p className="text-center">{`You can give now by using the button below OR by sending a check to:`}</p>
            <div className="address-button-container text-xl flex justify-center items-center my-double gap-double">
              <Link href={donationLink} passHref target="_blank" rel="noopener noreferrer">
                <Button variant="filled" size="xl" className="h-auto">
                  Donate Now
                </Button>
              </Link>
              <div className="address-container">
                <div className="museo text-3xl">
                  ensemble<span className="font-semibold">NEW</span>SRQ
                </div>
                <div>PO Box 15372</div>
                <div>Sarasota, FL 34277</div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div className="disclaimer flex flex-col gap-s mb-double">
          <p className="roboto-flex text-sm leading-none text-center">Questions? ensemblenewSRQ@gmail.com</p>
          <p className="roboto-flex text-sm leading-none text-center">
            {`“A COPY OF THE OFFICIAL REGISTRATION AND FINANCIAL INFORMATION MAY BE OBTAINED FROM THE DIVISION OF CONSUMER SERVICES BY CALLING TOLL-FREE WITHIN THE STATE. REGISTRATION DOES NOT IMPLY ENDORSEMENT, APPROVAL, OR RECOMMENDATION BY THE STATE.”`}
          </p>
          <ul className="roboto-flex text-sm leading-none text-center">
            <li>• 1-800-HELP-FLA (435-7352)</li>
            <li>• www.FloridaConsumerHelp.com</li>
          </ul>
        </div>
      </SectionEmpty>
    </div>
  );
}
