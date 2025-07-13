export default function TypographyTestSection() {
  return (
    <section className="mx-auto">
      <div className="space-y-12">
        {/* Headings */}
        <div>
          <h1 className="mb-4">Building the Future of Technology</h1>
          <h5 className="mb-4 font-kode-mono font-extrabold tracking-[-0.075em]">
            07/13/2025
          </h5>
          <h2 className="mb-3">Innovation Starts with Collaboration</h2>
          <h3 className="mb-2">Empowering Teams Worldwide</h3>
          <h4 className="mb-2">Solutions That Scale</h4>
        </div>

        {/* Body Text Variations */}
        <div className="space-y-6">
          <p className="body-lg">
            {`Our platform connects talented developers with cutting-edge projects across industries. From artificial
            intelligence to sustainable energy solutions, we're creating technology that makes a meaningful impact on
            society.`}
          </p>

          <p className="body-md">
            {`Every line of code matters. That's why we provide comprehensive tools and resources to help developers write cleaner, more efficient code. Join thousands of engineers who trust our platform to deliver exceptional results.`}
          </p>

          <p className="body-sm">
            {`Ready to transform your development workflow? Explore our documentation, connect with the community, and
            start building something extraordinary today.`}
          </p>
        </div>

        {/* Text Combinations */}
        <div className="space-y-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="heading-sm text-blue-900 mb-3">
              Featured Case Study
            </h3>
            <p className="text-blue-800 font-medium mb-2">
              Global Fintech Transformation
            </p>
            <p className="caption text-blue-700">
              {`How we helped reduce transaction processing time by 85% while maintaining bank-level security standards
              across 12 countries.`}
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <blockquote className="body-lg italic text-gray-700 mb-3">
              {`"This platform revolutionized how our team approaches complex problems. The collaboration tools alone
              saved us months of development time."`}
            </blockquote>
            <div className="caption font-kode-mono font-semibold text-green-600">
              Sarah Chen, Lead Engineer at TechFlow
            </div>
          </div>

          <div className="text-center">
            <h2 className="heading-md mb-2">Join the Movement</h2>
            <p className="body-md text-gray-600 mb-4">
              {`Be part of a community that's shaping tomorrow's technology landscape.`}
            </p>
            <p className="caption text-gray-500 uppercase tracking-wider">
              Trusted by 50,000+ developers worldwide
            </p>
          </div>
        </div>

        {/* Mixed Styling Showcase */}
        <div className="bg-gray-100 p-8 rounded-xl">
          <h3 className="heading-md font-black text-gray-900 mb-4">
            Performance Metrics That Matter
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h2 className="display-sm text-indigo-600 mb-1">99.9%</h2>
              <div className="caption font-medium text-gray-700 uppercase tracking-wide">
                Uptime Guarantee
              </div>
            </div>
            <div className="text-center">
              <h2 className="display-sm text-green-600 mb-1">
                <span className="text-lg">{"<"}</span>200ms
              </h2>
              <div className="caption font-medium text-gray-700 uppercase tracking-wide">
                Response Time
              </div>
            </div>
            <div className="text-center">
              <h2 className="display-sm text-orange-600 mb-1">24/7</h2>
              <div className="caption font-medium text-gray-700 uppercase tracking-wide">
                Expert Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
