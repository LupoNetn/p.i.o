import React from "react";

const projects = [
  {
    title: "Hit Track 1",
    description: "A fire Afrobeat track that topped the charts.",
    image: "/images/project1.jpg",
  },
  {
    title: "Hit Track 2",
    description: "Smooth RnB vibes crafted with precision.",
    image: "/images/project2.jpg",
  },
  {
    title: "Hit Track 3",
    description: "Trap anthem with hard-hitting basslines.",
    image: "/images/project3.jpg",
  },
  {
    title: "Hit Track 4",
    description: "Experimental beat with unique sound textures.",
    image: "/images/project4.jpg",
  },
];

const ProjectsSection = () => {
  return (
    <section className="text-text-primary app-container">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          My Projects
        </h2>
        <p className="text-text-muted font-body text-base md:text-lg">
          A showcase of beats, mixes, and collaborations crafted with passion and precision.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-background rounded-2xl overflow-hidden border border-color-border shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
          >
            {/* Image */}
            <div className="w-full h-48 md:h-56 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col items-start gap-3">
              <h3 className="text-xl md:text-2xl font-heading font-semibold">
                {project.title}
              </h3>
              <p className="text-text-muted font-body text-sm md:text-base">
                {project.description}
              </p>
              <button className="mt-2 px-4 py-2 bg-color-accent text-color-text-primary rounded-lg font-semibold hover:bg-color-highlight transition-colors duration-300">
                Listen Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
