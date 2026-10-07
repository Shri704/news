import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Globe } from 'lucide-react';

const SourceModal = ({ sources, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet Modal */}
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute bottom-0 left-0 right-0 z-50 bg-bg-darker/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl max-h-[85vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      >
        <div className="flex justify-between items-center p-6 pt-8 border-b border-white/5 relative">
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full"></div>
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <Globe className="text-primary" />
            Source Articles
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 md:p-6 pb-20 flex flex-col gap-4">
          {!sources || sources.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No source information available.</p>
          ) : (
            sources.map((source, idx) => (
              <a 
                key={source._id || idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    {source.sourceName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {source.publishedAt ? new Date(source.publishedAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                
                <h4 className="text-sm md:text-base font-semibold text-white mb-2 leading-snug group-hover:text-primary transition-colors">
                  {source.headline}
                </h4>
                
                {source.snippet && (
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                    {source.snippet}
                  </p>
                )}

                <div className="flex items-center text-xs text-primary font-medium">
                  Read Original <ExternalLink size={12} className="ml-1" />
                </div>
              </a>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SourceModal;
