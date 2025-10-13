import React from "react";

const AboutSection = () => {
  return (
    <section className="text-text-primary mb-12">
      <div className="max-w-5xl mx-auto text-left space-y-6">
        {/* Section Label */}
        <h2 className="font-heading font-bold text-2xl md:text-3xl">
          About the Baddest Producer
        </h2>

        {/* Description */}
        <p className="text-text-muted font-body text-sm md:text-lg leading-relaxed md:w-[90%]">
          Every great song begins with a vision — and behind that vision is a
          sound architect who knows how to bring it to life. With years of
          experience in music production, sound design, and mixing,{" "}
          <span className="text-text-primary font-semibold">
            the baddest producer
          </span>{" "}
          has crafted beats and soundscapes that move crowds and elevate artists
          beyond limits. From Afrobeat and RnB to Trap and Drill, each project
          is built with passion, precision, and a unique touch that sets it
          apart.
        </p>

        {/* Quote or Signature
        <blockquote className="text-color-accent italic text-lg md:text-xl font-heading mt-8">
          “It’s not just sound — it’s emotion, energy, and evolution.”
        </blockquote> */}
      </div>
    </section>
  );
};

export default AboutSection;
