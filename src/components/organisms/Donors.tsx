import donorTiersJson from "@/data/serve/donor-tiers.json"
import allDonorsJson from "@/data/serve/donors.json"

export function Donors() {
  return (
    <div className="donors-container flex flex-col gap-triple">
      {donorTiersJson.map((tier, index) => (
        <div key={index} className="tiers-item flex flex-col gap-s">
          <h2 className="museo-slab font-medium">{tier.label}</h2>
          <ul className={`${index < 3 ? "columns-1 md:columns-2 leading-none text-lg" : "columns-2 md:columns-3 lg:columns-4 text-sm"}`}>
            {allDonorsJson
              .filter((donor) => donor.donorTierId === tier.donorTierId)
              .sort((a, b) => {
                if (a.lastName && b.lastName) {
                  return a.lastName.localeCompare(b.lastName)
                } else if (a.displayName && b.displayName) {
                  return a.displayName.localeCompare(b.displayName)
                }
                return 0;
              })
              .map((donor, donorIndex) => (
                <li key={donorIndex}  className={`pl-4 [text-indent:-1rem] ${index < 3 ? "mb-half" : ""}`}>{donor.displayName}</li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
