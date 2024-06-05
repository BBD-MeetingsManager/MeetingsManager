import LandingIcon from '../components/icons/LandingIcon';
import Navbar from '../components/Navbar.tsx';

const Landing = () => {
  return (
    <div>
      <Navbar />
      <main className="w-full pt-16 md:pt-0 md:h-screen min-h-screen overflow-clip md:bg-gradient-to-r bg-gradient-to-b from-mint_cream to-charcoal-900">
        <section className="w-full h-full flex md:flex-row flex-col-reverse">
          <section className="w-full flex flex-col gap-2 justify-center md:px-32 px-10 py-8">
            <h2 className="text-5xl">
              {/* <span className="text-charcoal-400">—</span> */}
              {/* &nbsp; */}
              Simplify Your Meetings
            </h2>
            <h6 className="text-lg tracking-wider">Smart Scheduling. Enhanced Productivity.</h6>
            <p className="py-4 text-base text-charcoal-400">
              Schedule and manage your meetings effortlessly. Combine all your meetings from
              different platforms into one central hub.
            </p>
          </section>
          <section className="w-full flex items-center justify-center md:px-0">
            <LandingIcon width={360} />
          </section>
        </section>
      </main>
    </div>
  );
};

export default Landing;
