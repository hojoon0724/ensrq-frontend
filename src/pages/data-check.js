import fs from "fs/promises";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src/data");
const concertsDirectory = path.join(dataDirectory, "concerts");
const composersDirectory = path.join(dataDirectory, "composers");
const seasonsFilePath = path.join(dataDirectory, "seasons.json");

export async function getStaticProps() {
  try {
    // Read the concerts data from JSON files
    const files = await fs.readdir(concertsDirectory);
    const concertFiles = files.filter((file) => file.endsWith(".json"));

    const concerts = await Promise.all(
      concertFiles.map(async (file) => {
        const filePath = path.join(concertsDirectory, file);
        const content = await fs.readFile(filePath, "utf8");
        const concertData = JSON.parse(content);
        // Add the ID based on filename (without .json extension)
        const id = file.replace(".json", "");
        return { ...concertData, id };
      }),
    );

    const composers = await fs.readdir(composersDirectory);
    const composerData = await Promise.all(
      composers.map(async (file) => {
        const filePath = path.join(composersDirectory, file);
        const content = await fs.readFile(filePath, "utf8");
        return JSON.parse(content);
      }),
    );

    // Read the seasons data from JSON file
    const seasonsContent = await fs.readFile(seasonsFilePath, "utf8");
    const seasonsData = JSON.parse(seasonsContent);

    return {
      props: {
        concerts,
        composers: composerData,
        seasons: seasonsData,
      },
    };
  } catch (error) {
    console.error("Error reading data files:", error);
    return {
      props: {
        concerts: [],
        seasons: {},
      },
    };
  }
}
export default function DataCheck({ concerts, composers, seasons }) {
  // Group concerts by season and sort
  const groupConcertsBySeason = () => {
    const concertsBySeasonId = {};

    // First, create a map of concert ID to concert object
    const concertMap = {};
    concerts?.forEach((concert) => {
      concertMap[concert.id] = concert;
    });

    // Group concerts by season based on seasons.json structure
    Object.keys(seasons || {}).forEach((seasonKey) => {
      const concertIds = seasons[seasonKey] || [];
      concertsBySeasonId[seasonKey] = concertIds
        .map((id) => concertMap[id])
        .filter((concert) => concert) // Remove undefined concerts
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending
    });

    // Sort seasons in descending order (s10, s09, s08, ...)
    const sortedSeasons = Object.keys(concertsBySeasonId)
      .sort((a, b) => {
        const numA = parseInt(a.replace("s", ""));
        const numB = parseInt(b.replace("s", ""));
        return numB - numA; // Descending order
      })
      .filter((seasonKey) => concertsBySeasonId[seasonKey].length > 0); // Only show seasons with concerts

    return sortedSeasons.map((seasonKey) => ({
      seasonKey,
      seasonNumber: parseInt(seasonKey.replace("s", "")),
      concerts: concertsBySeasonId[seasonKey],
    }));
  };

  const seasonsWithConcerts = groupConcertsBySeason();
  const totalConcerts = seasonsWithConcerts.reduce(
    (sum, season) => sum + season.concerts.length,
    0,
  );

  // Calculate missing data statistics
  const calculateMissingData = () => {
    let worksWithoutComposerIds = 0;
    let worksWithMissingComposerData = 0;
    let worksWithMissingBirthYear = 0;
    let worksWithoutInstrumentation = 0;
    let totalWorks = 0;

    seasonsWithConcerts.forEach((season) => {
      season.concerts.forEach((concert) => {
        if (concert.program) {
          concert.program.forEach((work) => {
            totalWorks++;

            // Count works without composer IDs
            if (!work.composerId) {
              worksWithoutComposerIds++;
            }
            // Count works with composer IDs but missing composer data
            else if (!composers?.find((c) => c.id === work.composerId)) {
              worksWithMissingComposerData++;
            }
            // Count works with composer data but missing birth year
            else {
              const composer = composers?.find((c) => c.id === work.composerId);
              if (composer && !composer.born && !composer.birthYear) {
                worksWithMissingBirthYear++;
              }
            }

            // Count works without instrumentation
            if (!work.instrumentation || work.instrumentation.length === 0) {
              worksWithoutInstrumentation++;
            }
          });
        }
      });
    });

    return {
      totalWorks,
      worksWithoutComposerIds,
      worksWithMissingComposerData,
      worksWithMissingBirthYear,
      worksWithoutInstrumentation,
      totalComposerIssues:
        worksWithoutComposerIds +
        worksWithMissingComposerData +
        worksWithMissingBirthYear,
    };
  };

  const missingData = calculateMissingData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b-4 border-blue-500 pb-4">
          Data Check Dashboard
        </h1>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
            <h3 className="text-lg font-semibold text-gray-700">
              Active Seasons
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {seasonsWithConcerts.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Concerts
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalConcerts}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-700">Total Works</h3>
            <p className="text-3xl font-bold text-green-600">
              {missingData.totalWorks}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Composers
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {composers?.length || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-gray-700">
              Composer Issues
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {missingData.totalComposerIssues}
            </p>
            <div className="text-xs text-gray-500 mt-1">
              {missingData.worksWithoutComposerIds} no ID,{" "}
              {missingData.worksWithMissingComposerData} missing data,{" "}
              {missingData.worksWithMissingBirthYear} no birth year
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h3 className="text-lg font-semibold text-gray-700">
              Missing Instrumentation
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {missingData.worksWithoutInstrumentation}
            </p>
          </div>
        </div>

        {/* Concerts by Season */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-md mr-3">
              Concerts by Season
            </span>
            <span className="text-sm text-gray-500">
              ({totalConcerts} total concerts)
            </span>
          </h2>

          <div className="space-y-8">
            {seasonsWithConcerts.map((seasonData) => (
              <div
                key={seasonData.seasonKey}
                className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
              >
                {/* Season Header */}
                <div className="bg-gradient-to-r from-teal-200 to-teal-400 text-black p-6 flex justify-between items-center">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="bg-white bg-opacity-60 px-4 py-2 rounded-lg">
                      Season {seasonData.seasonNumber}
                    </span>
                    <span className="text-gray-900 text-lg">
                      {seasonData.concerts.length} concert
                      {seasonData.concerts.length !== 1 ? "s" : ""}
                    </span>
                  </h3>
                  <div className="mt-2 text-black text-sm">
                    {seasonData.concerts.length > 0 && (
                      <div className="flex flex-col text-right font-mono">
                        <span>from: {seasonData.concerts[0].date}</span>

                        <span>
                          to:{" "}
                          {
                            seasonData.concerts[seasonData.concerts.length - 1]
                              .date
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Concerts in Season */}
                <div className="p-4">
                  <div className="space-y-4">
                    {seasonData.concerts.map((concert, concertIndex) => (
                      <div
                        key={concert.id || concertIndex}
                        className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Concert Header - Compact */}
                        <div className="bg-gradient-to-r from-amber-300 to-amber-400 text-black px-4 py-2 flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className=" text-sm">📅 {concert.date}</span>
                            <h4 className="font-bold text-lg">
                              {concert.title || "Untitled Concert"}
                            </h4>
                          </div>
                          <div className="text-right  text-sm">
                            <div>📍 {concert.venue || "No venue"}</div>
                            <div>🎵 {concert.program?.length || 0} works</div>
                          </div>
                        </div>

                        {/* Works List - Data Dense */}
                        <div className="p-3">
                          {concert.program && concert.program.length > 0 ? (
                            <div className="space-y-2">
                              {concert.program.map((work, workIndex) => (
                                <div
                                  key={workIndex}
                                  className="bg-white border border-gray-200 rounded p-3"
                                >
                                  <div className="grid grid-cols-12 gap-3 items-start">
                                    {/* Composer - 3 columns */}
                                    <div className="col-span-3">
                                      {work.composerId ? (
                                        (() => {
                                          const composer = composers?.find(
                                            (c) => c.id === work.composerId,
                                          );
                                          return composer ? (
                                            <div className="flex flex-row items-center justify-between gap-2 w-full bg-green-50 border border-green-200 rounded p-2">
                                              <div className="">
                                                <div className="text-green-800 font-medium text-xs">
                                                  {composer.name}{" "}
                                                </div>
                                                <div className="text-green-600 text-xs">
                                                  ID: {work.composerId}
                                                </div>
                                              </div>
                                              <div className="composer-years text-xs">
                                                {composer.born ? (
                                                  <div className="born h-4">
                                                    {composer.born}
                                                  </div>
                                                ) : (
                                                  <div className="bg-red-500 border border-red-200 text-white rounded px-1">
                                                    No birth year
                                                  </div>
                                                )}

                                                <div className="died h-4">
                                                  {composer.died}
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="bg-red-50 border border-red-200 rounded p-2">
                                              <span className="text-red-800 font-medium text-xs">
                                                🚨 Composer json not found
                                              </span>
                                              <div className="text-red-600 text-xs">
                                                ID: {work.composerId}
                                              </div>
                                            </div>
                                          );
                                        })()
                                      ) : (
                                        <div className="bg-red-50 border border-red-200 rounded p-2">
                                          <span className="text-red-800 font-medium text-xs">
                                            ❌ Composer ID not entered
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Work Info - 5 columns */}
                                    <div className="col-span-5">
                                      <h5 className="font-semibold text-gray-900 text-sm leading-tight">
                                        {work.title || "Untitled Work"}
                                      </h5>
                                      <div className="flex gap-2 mt-1">
                                        {work.year && (
                                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                            {work.year}
                                          </span>
                                        )}
                                        {work.duration && (
                                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                            {work.duration}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Instrumentation - 4 columns */}
                                    <div className="col-span-4">
                                      {work.instrumentation &&
                                      work.instrumentation.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-1">
                                          {work.instrumentation.map(
                                            (inst, instIndex) => (
                                              <div
                                                key={instIndex}
                                                className="bg-gray-50 rounded p-1 border text-xs"
                                              >
                                                <div className="flex items-center gap-1">
                                                  {inst.count && (
                                                    <span className="bg-blue-500 text-white px-1 rounded-full text-xs font-bold min-w-[16px] text-center">
                                                      {inst.count}
                                                    </span>
                                                  )}
                                                  <span className="font-medium truncate">
                                                    {inst.instrument}
                                                  </span>
                                                  {inst.solo && (
                                                    <span className="text-orange-600">
                                                      ★
                                                    </span>
                                                  )}
                                                </div>
                                                {inst.musicians &&
                                                  inst.musicians.length > 0 && (
                                                    <div className="text-gray-600 text-xs mt-1 truncate">
                                                      👥{" "}
                                                      {inst.musicians.join(
                                                        ", ",
                                                      )}
                                                    </div>
                                                  )}
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-orange-600 bg-orange-50 border border-orange-200 rounded p-2 text-xs">
                                          ⚠️ No instrumentation
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              <span className="text-2xl">🎼</span>
                              <p className="text-sm mt-1">No program data</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {seasonsWithConcerts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <span className="text-6xl">🎭</span>
                <p className="mt-4 text-xl">No concerts found</p>
              </div>
            )}
          </div>
        </div>

        {/* Seasons Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="bg-purple-500 text-white px-3 py-1 rounded-md mr-3">
              Seasons
            </span>
            <span className="text-sm text-gray-500">
              ({Object.keys(seasons || {}).length} total)
            </span>
          </h2>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <pre className="text-sm text-gray-700 overflow-auto max-h-96 bg-gray-50 p-4 rounded border">
              {JSON.stringify(seasons, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
