import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineTrackChanges } from "react-icons/md";

const Hero = () => {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-center bg-no-repeat min-h-[80vh] sm:min-h-screen pt-16 sm:pt-0">
      {/* Hero Content */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10 sm:mt-14">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold mx-auto leading-tight sm:leading-[1.1] md:leading-[1.2] px-2">
          Create amazing content <br className="hidden sm:block" />
          with <span className="text-primary">AI tools</span>
        </h1>
        <p className="mt-2 sm:mt-3 md:mt-4 lg:mt-6 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 px-4 leading-relaxed">
          Transform your content creation with our suite of premium AI tools.
          Write articles, generate images, and enhance your workflow.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 px-4 mb-4 sm:mb-6 md:mb-8">
        <Link
          href="/auth/signup"
          className="w-full sm:w-auto bg-[#5044e5] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-sm sm:text-base md:text-lg flex gap-2 items-center font-medium shadow-lg hover:shadow-xl"
        >
          <div>
            <MdOutlineTrackChanges />
          </div>
          <div>Start tracking now</div>
        </Link>
        <Link
          href="/auth/login"
          type="button"
          className="w-full sm:w-auto bg-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg border border-gray-300 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-sm sm:text-base md:text-lg font-medium shadow-md hover:shadow-lg"
        >
          Sign In
        </Link>
      </div>

      {/* Social Proof */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mx-auto text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
        <Image
          src={assets.user_group}
          alt="Users"
          className="h-14"
        />
        <span className="whitespace-nowrap">Trusted by 10k+ people</span>
      </div>
    </div>
  );
};

export default Hero;
