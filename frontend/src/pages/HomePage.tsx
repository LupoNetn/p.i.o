import AboutSection from '../components/homeComponents/AboutSection'
import Cta from '../components/homeComponents/Cta'
import HeroSection from '../components/homeComponents/HeroSection'
import ProjectsSection from '../components/homeComponents/ProjectsSection'
import ServicesSection from '../components/homeComponents/ServicesSection'

const HomePage = () => {



  return (
    <>
     <div className='text-text-primary'>
       <div className=''>
        <HeroSection />
       </div>
      
      <div>
        <ProjectsSection />
      </div>
      <div>
        <ServicesSection />
      </div>
      <div>
        <AboutSection />
      </div>
      <div>
        <Cta />
      </div>
    </div>
    </>
  )
}

export default HomePage
