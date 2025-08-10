import { ProgramTile } from "@/components/molecules";
import { ProgramWork } from "@/types";

// Mock data for demonstration
const mockProgramWorks: ProgramWork[] = [
  {
    workId: "bach-brandenburg-3",
    is_premiere: false,
    is_commission: false,
    musicians: ["musician-1", "musician-2", "musician-3"],
  },
  {
    workId: "mozart-piano-sonata-11",
    is_premiere: true,
    premiere_text: "World Premiere - Commissioned by ENSRQ",
    is_commission: true,
    commission_text: "This work was specially commissioned for our ensemble.",
    musicians: ["musician-1", "musician-4"],
  },
  {
    workId: "beethoven-symphony-5",
    is_premiere: false,
    is_commission: false,
    musicians: ["musician-1", "musician-2", "musician-3", "musician-4", "musician-5"],
  },
];

export default function ProgramTileDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ProgramTile Component Demo</h1>
          <p className="text-lg text-gray-600">
            Showcasing different variations of the ProgramTile component with various color schemes
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Warm Color Scheme</h2>
            <ProgramTile programWork={mockProgramWorks[0]} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Cool Color Scheme (with Premiere & Commission)
            </h2>
            <ProgramTile programWork={mockProgramWorks[1]} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Neutral Color Scheme</h2>
            <ProgramTile programWork={mockProgramWorks[2]} />
          </div>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <strong>Composer Photos:</strong> Automatically loads composer photos from <code>/photos/composers/</code>{" "}
              with fallback to initials
            </li>
            <li>
              <strong>Toggleable Program Notes:</strong> Click &ldquo;Show Program Notes&rdquo; to reveal/hide detailed
              work descriptions
            </li>
            <li>
              <strong>Musicians Display:</strong> Shows all performers for each work with their instruments
            </li>
            <li>
              <strong>Color Schemes:</strong> Three distinct color themes (warm, cool, neutral) for visual variety
            </li>
            <li>
              <strong>Special Badges:</strong> Highlights premieres and commissioned works
            </li>
            <li>
              <strong>Complete Work Info:</strong> Displays movements, instrumentation, duration, and year
            </li>
            <li>
              <strong>Responsive Design:</strong> Adapts to different screen sizes with hover effects
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
