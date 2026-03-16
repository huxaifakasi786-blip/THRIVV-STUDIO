import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Loader2, Upload, Link as LinkIcon, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import useHomepageStore from '../../store/homepageStore';
import useProductStore from '../../store/productStore';
import useSettingsStore from '../../store/settingsStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const HomepageManager = () => {
    const { homepage, fetchHomepage, updateHomepage, loading } = useHomepageStore();
    const { products, fetchProducts } = useProductStore();
    const [isSaved, setIsSaved] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        hero: {
            title: '',
            subtitle: '',
            bannerUrl: '',
            buttonText: 'SHOP NOW',
            buttonLink: '/products'
        },
        sections: []
    });

    useEffect(() => { 
        fetchHomepage(); 
        fetchProducts();
    }, [fetchHomepage, fetchProducts]);

    useEffect(() => {
        if (homepage) {
            setFormData({
                hero: homepage.hero || { title: '', subtitle: '', bannerUrl: '', buttonText: 'SHOP NOW', buttonLink: '/products' },
                sections: homepage.sections || []
            });
        }
    }, [homepage]);

    const handleHeroChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            hero: { ...prev.hero, [name]: value }
        }));
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('image', file);
            const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setFormData(prev => ({
                ...prev,
                hero: { ...prev.hero, bannerUrl: data.url }
            }));
            toast.success('Banner uploaded!');
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const addSection = (type) => {
        const newSection = {
            type,
            title: type === 'featured_products' ? 'Featured Products' : 'New Collection',
            subtitle: '',
            items: [],
            categories: [],
            content: '',
            active: true,
            order: formData.sections.length
        };
        setFormData(prev => ({
            ...prev,
            sections: [...prev.sections, newSection]
        }));
    };

    const removeSection = (index) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index)
        }));
    };

    const moveSection = (index, direction) => {
        const newSections = [...formData.sections];
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        }
        setFormData(prev => ({ ...prev, sections: newSections }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateHomepage(formData);
        if (result.success) {
            setIsSaved(true);
            toast.success('Homepage updated!');
            setTimeout(() => setIsSaved(false), 3000);
        } else {
            toast.error(result.message || 'Update failed');
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <div>
                    <h1 className="text-3xl font-black uppercase text-white tracking-wider">Homepage Manager</h1>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">Customize your storefront experience</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading || isSaved}
                    className={`flex items-center gap-2 px-8 py-3 font-black uppercase tracking-[0.2em] text-xs transition-all ${isSaved ? 'bg-green-500 text-black' : 'bg-white text-black hover:bg-[var(--color-accent)] hover:text-white'} disabled:opacity-50`}
                >
                    {loading ? <><Loader2 size={14} className="animate-spin" /> Saving...</> :
                        isSaved ? <><CheckCircle size={14} /> Updated!</> :
                            <><Save size={14} /> Save Changes</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hero Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#111] p-6 border border-white/5">
                        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-6">Hero Section</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Banner Image</label>
                                <div className="flex gap-4">
                                    <div className="flex-grow">
                                        <input 
                                            type="text" 
                                            name="bannerUrl" 
                                            value={formData.hero.bannerUrl} 
                                            onChange={handleHeroChange} 
                                            className="admin-input" 
                                            placeholder="Image URL" 
                                        />
                                    </div>
                                    <label className="flex-shrink-0 cursor-pointer bg-white/5 border border-white/10 hover:border-white/30 px-4 flex items-center justify-center text-white transition-colors">
                                        <Upload size={14} />
                                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e.target.files[0])} />
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Headline</label>
                                    <textarea name="title" value={formData.hero.title} onChange={handleHeroChange} className="admin-input h-24 resize-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Subheadline</label>
                                    <textarea name="subtitle" value={formData.hero.subtitle} onChange={handleHeroChange} className="admin-input h-24 resize-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Builder */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Page Sections</h2>
                        </div>
                        
                        {formData.sections.length === 0 ? (
                            <div className="bg-white/5 border border-dashed border-white/10 py-12 text-center">
                                <p className="text-gray-500 text-xs uppercase tracking-widest">No sections added yet</p>
                            </div>
                        ) : (
                            formData.sections.map((section, idx) => (
                                <div key={idx} className="bg-[#111] border border-white/5 p-6 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/10 text-white text-[10px] font-black px-2 py-1 uppercase">{section.type.replace('_', ' ')}</div>
                                            <div className="flex gap-1">
                                                <button onClick={() => moveSection(idx, 'up')} className="p-1 text-gray-600 hover:text-white"><ArrowUp size={14} /></button>
                                                <button onClick={() => moveSection(idx, 'down')} className="p-1 text-gray-600 hover:text-white"><ArrowDown size={14} /></button>
                                            </div>
                                        </div>
                                        <button onClick={() => removeSection(idx)} className="p-1 text-red-500/50 hover:text-red-500"><Trash2 size={16} /></button>
                                    </div>
                                    <div className="space-y-4">
                                        <input 
                                            type="text" 
                                            value={section.title} 
                                            onChange={(e) => {
                                                const newSections = [...formData.sections];
                                                newSections[idx].title = e.target.value;
                                                setFormData({ ...formData, sections: newSections });
                                            }}
                                            className="admin-input" 
                                            placeholder="Section Title" 
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="bg-[#111] p-6 border border-white/5">
                        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-6">Add Section</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={() => addSection('featured_products')} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 p-4 text-xs font-bold uppercase tracking-widest text-left transition-all">
                                <Plus size={16} className="text-[var(--color-accent)]" />
                                <span>Featured Products</span>
                            </button>
                            <button onClick={() => addSection('categories_grid')} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 p-4 text-xs font-bold uppercase tracking-widest text-left transition-all">
                                <Plus size={16} className="text-[var(--color-accent)]" />
                                <span>Categories Grid</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-black border border-[var(--color-accent)]/20 p-6">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Live Preview (Mobile)</p>
                        <div className="aspect-[9/16] bg-[#050505] rounded-xl overflow-hidden border border-white/5">
                            <div className="h-full overflow-y-auto scrollbar-hide">
                                {/* Simple Mockup */}
                                <div className="h-40 bg-gray-900 flex items-center justify-center relative">
                                    <img src={formData.hero.bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                    <div className="relative text-center p-4">
                                        <h4 className="text-[10px] font-black text-white leading-tight uppercase whitespace-pre-line">{formData.hero.title}</h4>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    {formData.sections.map((s, i) => (
                                        <div key={i} className="h-20 bg-white/5 flex items-center justify-center">
                                            <span className="text-[8px] font-black uppercase text-gray-700">{s.title || s.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomepageManager;
