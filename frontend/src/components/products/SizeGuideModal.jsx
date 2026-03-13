import React from 'react';
import { X } from 'lucide-react';

const SizeGuideModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-3xl bg-[#0A0A0A] border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#111]">
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest">
                        Size <span className="text-[var(--color-accent)]">Guide</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    <p className="text-gray-400 text-sm mb-6 uppercase tracking-wider">
                        All measurements are in inches. Fits may vary by style or personal preference.
                    </p>

                    <div className="space-y-8">
                        {/* Tops Table */}
                        <div>
                            <h3 className="text-white font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Tops / Hoodies</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-white/5 text-gray-400 uppercase tracking-wider">
                                            <th className="px-4 py-3 font-bold rounded-tl">Size</th>
                                            <th className="px-4 py-3 font-bold">Chest</th>
                                            <th className="px-4 py-3 font-bold">Length</th>
                                            <th className="px-4 py-3 font-bold rounded-tr">Sleeve</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-gray-300">
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-bold text-white">XS</td>
                                            <td className="px-4 py-3">34 - 36</td>
                                            <td className="px-4 py-3">26</td>
                                            <td className="px-4 py-3">32.5</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-bold text-white">S</td>
                                            <td className="px-4 py-3">36 - 38</td>
                                            <td className="px-4 py-3">27</td>
                                            <td className="px-4 py-3">33.5</td>
                                        </tr>
                                        <tr className="bg-[var(--color-accent)]/5 hover:bg-[var(--color-accent)]/10 transition-colors border-l-2 border-[var(--color-accent)]">
                                            <td className="px-4 py-3 font-bold text-white">M <span className="text-[10px] text-[var(--color-accent)] uppercase ml-2">Popular</span></td>
                                            <td className="px-4 py-3">38 - 40</td>
                                            <td className="px-4 py-3">28</td>
                                            <td className="px-4 py-3">34.5</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-bold text-white">L</td>
                                            <td className="px-4 py-3">40 - 42</td>
                                            <td className="px-4 py-3">29</td>
                                            <td className="px-4 py-3">35.5</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-bold text-white">XL</td>
                                            <td className="px-4 py-3">42 - 44</td>
                                            <td className="px-4 py-3">30</td>
                                            <td className="px-4 py-3">36.5</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-bold text-white">XXL</td>
                                            <td className="px-4 py-3">44 - 46</td>
                                            <td className="px-4 py-3">31</td>
                                            <td className="px-4 py-3">37.5</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Bottoms Table */}
                        <div>
                            <h3 className="text-white font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Bottoms / Pants</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead>
                                        <tr className="bg-white/5 text-gray-400 uppercase tracking-wider">
                                            <th className="px-4 py-3 font-bold rounded-tl">Size</th>
                                            <th className="px-4 py-3 font-bold">Waist</th>
                                            <th className="px-4 py-3 font-bold">Inseam</th>
                                            <th className="px-4 py-3 font-bold rounded-tr">US Numeric</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-gray-300">
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-bold text-white">S</td>
                                            <td className="px-4 py-3">28 - 30</td>
                                            <td className="px-4 py-3">29</td>
                                            <td className="px-4 py-3">28-30</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-bold text-white">M</td>
                                            <td className="px-4 py-3">31 - 33</td>
                                            <td className="px-4 py-3">30</td>
                                            <td className="px-4 py-3">31-33</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-bold text-white">L</td>
                                            <td className="px-4 py-3">34 - 36</td>
                                            <td className="px-4 py-3">31</td>
                                            <td className="px-4 py-3">34-36</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3 font-bold text-white">XL</td>
                                            <td className="px-4 py-3">37 - 39</td>
                                            <td className="px-4 py-3">32</td>
                                            <td className="px-4 py-3">38-40</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* How to Measure */}
                        <div className="bg-[#111] p-6 rounded border border-white/5 mt-6">
                            <h3 className="text-[var(--color-accentSecondary)] font-bold uppercase tracking-wider mb-4">How To Measure</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-400">
                                <div>
                                    <span className="text-white font-bold block mb-1">Chest</span>
                                    Measure around the fullest part of your chest, keeping tape horizontal.
                                </div>
                                <div>
                                    <span className="text-white font-bold block mb-1">Waist</span>
                                    Measure around the narrowest part (typically where your body bends side to side).
                                </div>
                                <div>
                                    <span className="text-white font-bold block mb-1">Inseam</span>
                                    Measure from the top of your inner thigh along the inside seam to the bottom of your leg.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeGuideModal;
