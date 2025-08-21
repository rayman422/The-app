import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { FishingEcommerce } from './FishingEcommerce';

export const GearList = ({ setPage }) => (
	<div className="bg-slate-900 min-h-screen pb-20">
		<div className="flex items-center text-white mb-2 p-4">
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => setPage('profile')}
				className="p-2 -ml-2 rounded-lg hover:bg-slate-800"
			>
				<ChevronLeft size={24} />
			</motion.button>
			<h1 className="flex-1 text-center text-xl font-bold">Shop Gear</h1>
			<div className="w-10"></div>
		</div>
		<FishingEcommerce />
	</div>
);