import HudFeaturedCard from './HudFeaturedCard'
import styles from './ProjectGrid.module.css'

export default function ProjectGrid({ projects, mx, my }) {
  return (
    <div className={styles.grid}>
      {projects.map((project, index) => (
        <HudFeaturedCard key={project.slug} project={project} index={index} mx={mx} my={my} />
      ))}
    </div>
  )
}
