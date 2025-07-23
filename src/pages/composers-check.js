import fs from "fs/promises";
import path from "path";

const dataDirectory = path.join(process.cwd(), "src/data");
const composersDirectory = path.join(dataDirectory, "composers");

export async function getStaticProps() {
  try {
    // Read all composer files in the composers directory
    const files = await fs.readdir(composersDirectory);
    const composers = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(composersDirectory, file);
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
      }),
    );

    return {
      props: {
        composers,
      },
    };
  } catch (error) {
    console.error("Error reading composer files:", error);
    return {
      props: {
        composers: [],
      },
    };
  }
}

export default function ComposersCheck({ composers }) {
  const headerKeys = [
    "id",
    "name",
    "nationality",
    "born",
    "died",
    "has_photo",
    "bio",
  ];
  const composerCount = composers.length - 1;

  function countMissingData(composers) {
    let issues = 0;
    let missingNationality = 0;
    let missingBorn = 0;
    let missingBio = 0;
    composers.forEach((composer) => {
      if (!composer.id) issues++;
      if (!composer.name) issues++;
      if (!composer.nationality) {
        issues++;
        missingNationality++;
      }
      if (!composer.born) {
        issues++;
        missingBorn++;
      }
      if (!composer.bio) {
        issues++;
        missingBio++;
      }
    });
    return { issues, missingNationality, missingBorn, missingBio };
  }

  let missingData = countMissingData(composers);
  // console.log(missingData);

  function composersAllKeys(composers) {
    console.log(composers)
    for (let composer of composers) {
      for (let key of headerKeys) {
        console.log(key, composer[key]);
        return key, composer[key];
      }
    }
  }

  composersAllKeys(composers);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <h1 className="text-4xl font-bold mb-12">Composers Check</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Composers
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            {composers.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-gray-700">Total Issues</h3>
          <p className="text-3xl font-bold text-purple-600">
            {missingData.issues}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-700">Missing</h3>
          <div className="text-xl font-bold text-red-600 flex flex-col">
            <div className="flex justify-between">
              <span> born </span>
              <span>{missingData.missingBorn}</span>
            </div>
            <div className="flex justify-between">
              <span> nationality </span>
              <span>{missingData.missingNationality}</span>
            </div>
            <div className="flex justify-between">
              <span> bio</span>
              <span>{missingData.missingBio}</span>
            </div>
          </div>
        </div>
      </div>
      <ul>
        <table>
          <thead>
            <tr>
              {headerKeys.map((key) => (
                <th key={key} className="px-4 py-2 border">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {composers.map((composer, index) => (
              <tr key={index}>
                {headerKeys.map((key) => (
                  <td
                    key={key}
                    className={`px-4 py-2 border 
                      ${composer[key] || key === "died" ? "" : "bg-red-400"} 
                      ${key === "id" ? "text-gray-400" : ""}
                    `}
                  >
                    {key === "bio"
                      ? composer["bio"]
                        ? "exists"
                        : "missing"
                      : `${composer[key] || "-"}`}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ul>
    </div>
  );
}
