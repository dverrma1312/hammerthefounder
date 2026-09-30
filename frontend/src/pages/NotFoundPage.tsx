import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-8xl md:text-9xl font-heading font-bold mb-4"
        >
          404
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-text-secondary font-mono mb-8"
        >
          NOT_FOUND // PAGE_MISSING
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link 
            to="/" 
            className="inline-block px-6 py-3 border border-border hover:border-text transition-colors font-mono text-sm uppercase tracking-wider"
          >
            ← Return to Base
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
