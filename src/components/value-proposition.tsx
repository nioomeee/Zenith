export default function ValueProposition() {
  return (
    <section className="border-b-4 border-[#121212] bg-[#f5f5f5] px-4 py-16 relative">
      {/* Subtle grainy texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto relative">
        <h2 className="mb-12 font-sans text-4xl font-extrabold text-[#121212]">
          WHY CHOOSE ZENITH?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* First column - slightly wider */}
          <div className="md:col-span-1 md:pr-6">
            <div className="mb-6 ml-4">
              {/* Custom mentorship icon */}
              <div className="relative h-24 w-24">
                <div className="absolute left-0 top-0 h-16 w-16 border-4 border-[#121212] rounded-full"></div>
                <div className="absolute bottom-0 right-0 h-12 w-12 border-4 border-[#121212] rounded-full"></div>
                <div className="absolute left-10 top-8 h-16 w-4 border-4 border-[#121212] rotate-45"></div>
              </div>
            </div>
            <h3 className="mb-4 font-sans text-2xl font-bold text-[#121212]">
              Find Your Mentor
            </h3>
            <p className="text-lg text-[#121212]">
              Our smart matching algorithm connects you with alumni mentors who
              share your interests, career goals, and values. Get personalized
              guidance from those who've walked your path.
            </p>
          </div>

          {/* Second column - offset vertically */}
          <div className="md:col-span-1 md:mt-12">
            <div className="mb-6 ml-8">
              {/* Custom network icon */}
              <div className="relative h-24 w-24">
                <div className="absolute left-0 top-0 h-12 w-12 border-4 border-[#121212] rounded-full"></div>
                <div className="absolute right-0 top-0 h-12 w-12 border-4 border-[#121212] rounded-full"></div>
                <div className="absolute bottom-0 left-6 h-12 w-12 border-4 border-[#121212] rounded-full"></div>
                <div className="absolute left-4 top-4 h-20 w-4 border-4 border-[#121212] rotate-45"></div>
                <div className="absolute right-4 top-4 h-16 w-4 border-4 border-[#121212] rotate-[135deg]"></div>
              </div>
            </div>
            <h3 className="mb-4 font-sans text-2xl font-bold text-[#121212]">
              Expand Your Network
            </h3>
            <p className="text-lg text-[#121212]">
              Join interest-based groups, attend virtual events, and connect
              with alumni across industries. Build relationships that last
              beyond graduation.
            </p>
          </div>

          {/* Third column */}
          <div className="md:col-span-1">
            <div className="mb-6 ml-2">
              {/* Custom career icon */}
              <div className="relative h-24 w-24">
                <div className="h-16 w-20 border-4 border-[#121212]"></div>
                <div className="absolute -top-2 left-6 h-4 w-8 border-4 border-[#121212]"></div>
              </div>
            </div>
            <h3 className="mb-4 font-sans text-2xl font-bold text-[#121212]">
              Launch Your Career
            </h3>
            <p className="text-lg text-[#121212]">
              Discover job opportunities with "warm introductions" to alumni at
              hiring companies. Get insider advice through flash mentoring and
              AMA sessions with industry experts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
