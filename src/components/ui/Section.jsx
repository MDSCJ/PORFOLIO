import { motion } from 'framer-motion'

// At least one screen tall, but grows with its content (important on phones). Each section maps to a 3D keyframe.
// `layout` replaces the default alignment/padding; `className` adds to it.
// `reveal={false}` skips the scroll fade-in (e.g. when the content runs its own entrance animation).
export default function Section({ id, layout = 'items-center py-24', className = '', reveal = true, children }) {
  return (
    <section
      id={id}
      className={`relative flex min-h-svh w-full px-5 sm:px-8 md:px-16 ${layout} ${className}`}
    >
      <motion.div
        className="w-full"
        initial={reveal ? { opacity: 0, y: 40 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  )
}
