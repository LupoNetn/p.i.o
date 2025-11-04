import { PlayCircleIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const demoProjects = [
  {
    name: "Subtle Beatz",
    artist: "Zammy",
    genre: "Afro Trap",
    cover: "/images/subtle-beatz.jpg",
    audioUrl: "/audio/subtle-beatz.mp3",
  },
  {
    name: "Chilly Beatz",
    artist: "X-Dilly",
    genre: "Drill",
    cover: "/images/chilly-beatz.jpg",
    audioUrl: "/audio/chilly-beatz.mp3",
  },
  {
    name: "Brazzyy Beatz",
    artist: "Leodaiii",
    genre: "Amapiano",
    cover: "/images/brazzyy-beatz.jpg",
    audioUrl: "/audio/brazzyy-beatz.mp3",
  },
  {
    name: "Funkyyy Beatz",
    artist: "Xion",
    genre: "Hip-Hop",
    cover: "/images/funkyyy-beatz.jpg",
    audioUrl: "/audio/funkyyy-beatz.mp3",
  },
];

const ProjectsSection = () => {
  return (
    <section className="font-audio app-container">
      {/* Header */}
      <div className="text-left">
        <h2 className="text-4xl font-bold mb-2">Projects</h2>
        <p className="text-gray-300">
          Some of my baddest productions.
        </p>
      </div>

      {/* Project Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mt-12">
        {/* Center vertical line for desktop */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-white/30 transform -translate-x-1/2">
          {/* Dots for desktop line */}
          <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full top-[30%]" />
          <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full bottom-[30%]" />
        </div>

        {demoProjects.map((project, index) => (
          <div
            key={index}
            className="relative group flex items-stretch md:items-center"
          >
            <Card
              className="flex-1 bg-black/40 border border-white/10 backdrop-blur-sm
                         hover:scale-[1.02] transition-all duration-300 rounded-2xl overflow-hidden"
            >
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <img
                  src={project.cover}
                  alt={project.name}
                  className="rounded-lg mb-3 w-full h-36 object-cover"
                />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white capitalize">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base">
                    {project.artist} • {project.genre}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <audio controls className="w-[80%] rounded-md">
                    <source src={project.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                  <PlayCircleIcon
                    size={34}
                    className="text-white hover:text-purple-400 transition-colors cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Line on right for mobile */}
        <div className="absolute right-[-12px] top-0 bottom-0 w-[2px] bg-white/20 md:hidden">
          {/* Dots for mobile line */}
          <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full top-[20%]" />
          <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full top-[50%]" />
          <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full bottom-[20%]" />
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
