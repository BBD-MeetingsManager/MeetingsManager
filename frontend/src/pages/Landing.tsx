import LandingIcon from "../components/icons/LandingIcon"

const Landing = () => {
    return (
        <main className="w-full pt-16 md:pt-0 md:h-screen min-h-screen overflow-clip md:bg-gradient-to-r bg-gradient-to-b from-anti-flash-white to-paynes-gray-800">
            <section className="w-full h-full flex md:flex-row flex-col-reverse">
                <section className="w-full flex flex-col gap-2 justify-center md:px-32 px-10 py-8">
                    <h2 className="text-5xl">
                        {/* <span className="text-paynes-gray-400">—</span> */}
                        {/* &nbsp; */}
                        Simplify Your Meetings
                    </h2>
                    <h6 className="text-lg tracking-wider">Smart Scheduling. Enhanced Productivity.</h6>
                    <p className="py-4 text-base text-paynes-gray-400">Schedule and manage your mettings effortlessly. Combine all your meetings from different platforms into one central hub.</p>
                </section>
                <section className="w-full flex items-center justify-center md:px-0">
                    <LandingIcon
                        width={360}
                    />
                </section>
            </section>
        </main>
    )
}

export default Landing