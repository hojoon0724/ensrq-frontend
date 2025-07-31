export default function TypographyTest() {
  return (
    <main className="min-h-screen max-w-screen py-triple px-s">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Hero/display-style usage */}
        <div className="space-y-4">
          <h1 className="h1">Summer Concert Series 2025</h1>
          <h2 className="h1">An Enchanting Journey Through Classical Masterpieces Under the Stars</h2>
        </div>

        {/* div Titles */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="h2">Season Overview</h3>
            <p className="p">
              Welcome to our tenth anniversary season, where each concert transports you to a new world of sound.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="h2">Featured Concerts</h3>
            <p className="p">
              From intimate chamber nights to grand orchestral experiences, we’ve curated six unforgettable evenings.
            </p>
          </div>
        </div>

        {/* Subdiv Headings */}
        <div className="space-y-4">
          <h3 className="h3">Chamber Night: Strings in the Moonlight</h3>
          <p className="p">
            <span className="span">Date:</span> July 10, 2025
            <br />
            <span className="span">Venue:</span> Riverside Pavilion
          </p>
        </div>

        {/* Smaller headings */}
        <div className="space-y-4">
          <h4 className="h4">Program</h4>
          <ul className="list-disc list-inside space-y-1">
            <li className="p">Mozart: String Quartet No. 19 (“Dissonance”)</li>
            <li className="p">Dvořák: String Quintet in G Major, Op. 77</li>
            <li className="p">Schubert: “Death and the Maiden” Quartet</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h5 className="h5">Artists</h5>
          <p className="p">
            Featuring the Luna Quartet&nbsp;
            <span className="span">(Violinists: A. Smith &amp; J. Lee, Violist: M. García, Cellist: R. Patel)</span>
          </p>
        </div>

        <div className="space-y-2">
          <h6 className="h6">Tickets &amp; Info</h6>
          <p className="p">
            Early-bird tickets start at $25. <span className="span">Buy now to save 15% off standard pricing.</span>
          </p>
        </div>

        {/* Paragraph variations */}
        <div className="space-y-4">
          <h3 className="h3">Long-form Paragraph Example</h3>
          <p className="p">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod eu lorem et ultricies. In porta lorem
            at dui semper porttitor. Nullam quis cursus dui. Cras tincidunt vehicula tellus eu facilisis. Donec nisi
            sapien, consequat ac felis in, rhoncus dignissim quam. Curabitur non velit nec nisl tincidunt laoreet non eu
            ipsum. Aliquam erat volutpat. Suspendisse potenti.
          </p>

          <h3 className="h3">Short-form Paragraph Example</h3>
          <p className="p">Join us for an evening of timeless elegance.</p>
        </div>

        {/* Inline span demo */}
        <div className="space-y-2">
          <h4 className="h4">Inline Text Example</h4>
          <p className="p">
            Our next guest artist is <span className="span">Mei-Ling Chen</span>, whose virtuosic violin performance has
            dazzled audiences worldwide.
          </p>
        </div>
      </div>

      <div className="bg-white text-gray-900 px-6 py-12 space-y-12 flex flex-col items-center">
        {/* Program Title & Date */}
        <div className="space-y-2 text-center">
          <h2 className="program-title">Cosmic Noise</h2>
          <div className="program-date">2025/07/10 · 7:30pm</div>
        </div>

        {/* First Piece */}
        <article className="program-work-line">
          {/* Left: Composer */}
          <div>
            <h3 className="program-composer text-right">Caroline Shaw</h3>
          </div>

          {/* Right: Work Info */}
          <div className="program-work-info">
            <div>
              <h4 className="program-work-title flex m-0">Partita for 8 Voices</h4>
              <p className="program-work-subtitle">2012 · Pulitzer Prize winner</p>
            </div>
            <ul className="program-movements list-none">
              <li className="flex">
                <span className="program-movement-number ">I.</span>
                <span>Allemande</span>
              </li>
              <li className="flex">
                <span className="program-movement-number">II.</span>
                <span>Sarabande</span>
              </li>
              <li className="flex">
                <span className="program-movement-number">III.</span>
                <span>Courante</span>
              </li>
              <li className="flex">
                <span className="program-movement-number">IV.</span>
                <span>Passacaglia</span>
              </li>
            </ul>
          </div>

          {/* Full Width: Performers */}
          <div className="md:col-span-2 text-center">
            <ul className="program-performers list-none">
              <li>Jessie Cox, Conductor</li>
              <li>Alex Kim, Violin</li>
              <li>Maria Lopez, Viola</li>
              <li>James Chen, Cello</li>
              <li>Sophia Patel, Flute</li>
              <li>Daniel Lee, Clarinet</li>
              <li>Emily Johnson, Piano</li>
              <li>Michael Brown, Percussion</li>
              <li>Olivia Davis, Harp</li>
              <li>David Martinez, Trumpet</li>
            </ul>
          </div>
        </article>

        {/* Intermission */}
        <div className="program-intermission text-center pt-6">Intermission</div>

        {/* Second Piece */}
        <article className="program-work-line">
          {/* Left: Composer */}
          <div>
            <h3 className="program-composer text-right">Julius Eastman</h3>
          </div>

          {/* Right: Work Info */}
          <div className="program-work-info">
            <h4 className="program-work-title">Stay On It</h4>
          </div>

          {/* Full Width: Performers */}
          <div className="md:col-span-2 text-center">
            <ul className="program-performers list-none">
              <li className="program-performers">Conduction by Jessie Cox</li>
            </ul>
          </div>
        </article>

        {/* Disclaimer */}
        <div className="pt-6 text-center">
          <p className="program-disclaimer">Program subject to change without notice.</p>
        </div>
      </div>
    </main>
  );
}
