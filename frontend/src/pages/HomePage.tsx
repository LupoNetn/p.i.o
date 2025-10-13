import React from 'react'
import { Button } from '../components/ui/button'
import HeroSection from '../components/homeComponents/HeroSection'
import AboutSection from '../components/homeComponents/AboutSection'
import ServicesSection from '../components/homeComponents/ServicesSection'
import ProjectsSection from '../components/homeComponents/ProjectsSection'

const HomePage = () => {
  return (
    <>
     <div className='text-text-primary'>
       <div className=''>
        <HeroSection />
       </div>
      {/* <div>
         <ServicesSection />
      </div>
      <div className="app-container">
        <AboutSection />
      </div>
      <ProjectsSection /> */}
    </div>
    </>
  )
}

export default HomePage
