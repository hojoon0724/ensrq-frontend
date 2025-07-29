export default function TestSpacing() {
  return (
    <div className="p-8 flex gap-s">
      <div className="all-sides">
        <h1 className="text-2xl mb-4">Testing Custom Spacing</h1>

        <div className="space-y-4">
          <div className="bg-red-200 p-quarter">
            <div className="bg-red-400">p-quarter</div>
          </div>

          <div className="bg-blue-200 p-half">
            <div className="bg-blue-400">p-half</div>
          </div>

          <div className="bg-green-200 p-s">
            <div className="bg-green-400">p-s</div>
          </div>

          <div className="bg-yellow-200 p-double">
            <div className="bg-yellow-400">p-double</div>
          </div>

          <div className="bg-purple-200 p-triple">
            <div className="bg-purple-400">p-triple</div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-red-200">
            <div className="bg-red-400 m-quarter">m-quarter</div>
          </div>

          <div className="bg-blue-200">
            <div className="bg-blue-400 m-half">m-half</div>
          </div>

          <div className="bg-green-200">
            <div className="bg-green-400 m-s">m-s</div>
          </div>
        </div>
      </div>
      <div className="x-axis">
        <h1 className="text-2xl mb-4">X-Axis</h1>

        <div className="space-y-4">
          <div className="bg-red-200 px-quarter">
            <div className="bg-red-400">px-quarter</div>
          </div>

          <div className="bg-blue-200 px-half">
            <div className="bg-blue-400">px-half</div>
          </div>

          <div className="bg-green-200 px-s">
            <div className="bg-green-400">px-s</div>
          </div>

          <div className="bg-yellow-200 px-double">
            <div className="bg-yellow-400">px-double</div>
          </div>

          <div className="bg-purple-200 px-triple">
            <div className="bg-purple-400">px-triple</div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-red-200">
            <div className="bg-red-400 mx-quarter">mx-quarter</div>
          </div>

          <div className="bg-blue-200">
            <div className="bg-blue-400 mx-half">mx-half</div>
          </div>

          <div className="bg-green-200">
            <div className="bg-green-400 mx-s">mx-s</div>
          </div>
        </div>
      </div>
      <div className="y-axis">
        <h1 className="text-2xl mb-4">Y-Axis</h1>

        <div className="space-y-4">
          <div className="bg-red-200 py-quarter">
            <div className="bg-red-400">py-quarter</div>
          </div>

          <div className="bg-blue-200 py-half">
            <div className="bg-blue-400">py-half</div>
          </div>

          <div className="bg-green-200 py-s">
            <div className="bg-green-400">py-s</div>
          </div>

          <div className="bg-yellow-200 py-double">
            <div className="bg-yellow-400">py-double</div>
          </div>

          <div className="bg-purple-200 py-triple">
            <div className="bg-purple-400">py-triple</div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-red-200">
            <div className="bg-red-400 my-quarter">my-quarter</div>
          </div>

          <div className="bg-blue-200">
            <div className="bg-blue-400 my-half">my-half</div>
          </div>

          <div className="bg-green-200">
            <div className="bg-green-400 my-s">my-s</div>
          </div>
        </div>
      </div>
    </div>
  );
}
