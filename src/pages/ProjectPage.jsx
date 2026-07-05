import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjectBySlug } from '../data/projects'
import MediaGallery from '../components/MediaGallery'
import styles from './ProjectPage.module.css'

export default function ProjectPage() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  if (!project) return <Navigate to="/" replace />

  return (
    <div className={`${styles.page} container`}>
      <Link to="/" className={styles.back} data-cursor-hover>
        ← Home
      </Link>

      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={styles.category}>{project.category}</span>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.summary}>{project.summary}</p>
      </motion.header>

      {(project.description || project.externalUrl) && (
        <div className={styles.intro}>
          {project.description && (
            <blockquote className={styles.description}>
              {project.description}
              {project.descriptionAttribution && (
                <cite className={styles.cite}>— {project.descriptionAttribution}</cite>
              )}
            </blockquote>
          )}
          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.external}
              data-cursor-hover
            >
              {project.externalLabel ?? 'View external site'} ↗
            </a>
          )}
        </div>
      )}

      {project.sections.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2 className={styles.sectionHeading}>{section.heading}</h2>
          <MediaGallery media={section.media} />
        </section>
      ))}
    </div>
  )
}
