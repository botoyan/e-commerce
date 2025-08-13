import { motion } from "framer-motion";

export default function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 custom-grid-520 custom-grid-820 lg:grid-cols-4 gap-10 px-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.6, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.04 }}
          className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between min-w-[240px] animate-pulse"
        >
          <div className="h-4 w-24 bg-zinc-200 rounded-full mb-3" />
          <div className="w-full h-[295px] bg-zinc-200 rounded-xl mb-4" />
          <div className="mb-4 space-y-2">
            <div className="h-4 w-3/4 bg-zinc-200 rounded" />
            <div className="h-3 w-5/6 bg-zinc-200 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-6 w-16 bg-zinc-200 rounded" />
            <div className="h-8 w-24 bg-zinc-300 rounded-lg" />
          </div>
        </motion.div>
      ))}
      <style jsx>{`
        @media (min-width: 820px) and (max-width: 1080px) {
          .custom-grid-820 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @media (min-width: 520px) and (max-width: 819px) {
          .custom-grid-520 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
