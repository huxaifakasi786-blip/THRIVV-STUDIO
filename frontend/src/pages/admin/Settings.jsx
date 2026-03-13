import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, Loader2, Upload, Link as LinkIcon } from 'lucide-react';
import useSettingsStore from '../../store/settingsStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Settings = () => {
    const { settings, fetchSettings, updateSettings, loading } = useSettingsStore();
    const [isSaved, setIsSaved] = useState(false);
    const [bannerMode, setBannerMode] = useState('url'); // 'url' | 'upload'
    const [logoMode, setLogoMode] = useState('url');
    const [uploading, setUploading] = useState({ banner: false, logo: false });

    const [formData, setFormData] = useState({
        siteName: '', siteDescription: '', contactEmail: '',
        instagram: '', facebook: '', twitter: '', tiktok: '',
        heroTitle: '', heroSubtitle: '', footerText: '',
        heroBannerUrl: '', logoUrl: '', shippingFee: 300, freeShippingThreshold: 5000,
    });

    useEffect(() => { fetchSettings(); }, [fetchSettings]);

    useEffect(() => {
        if (settings) {
            setFormData({
                siteName: settings.siteName || '',
                siteDescription: settings.siteDescription || '',
                contactEmail: settings.contactEmail || '',
                instagram: settings.socialLinks?.instagram || '',
                facebook: settings.socialLinks?.facebook || '',
                twitter: settings.socialLinks?.twitter || '',
                tiktok: settings.socialLinks?.tiktok || '',
                heroTitle: settings.heroTitle || '',
                heroSubtitle: settings.heroSubtitle || '',
                footerText: settings.footerText || '',
                heroBannerUrl: settings.heroBannerUrl || '',
                logoUrl: settings.logoUrl || '',
                shippingFee: settings.shippingFee ?? 300,
                freeShippingThreshold: settings.freeShippingThreshold ?? 5000,
            });
        }
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (field, file) => {
        if (!file) return;
        setUploading(prev => ({ ...prev, [field]: true }));
        try {
            const fd = new FormData();
            fd.append('image', file);
            const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setFormData(prev => ({ ...prev, [field]: data.url }));
            toast.success('Image uploaded successfully!');
        } catch {
            toast.error('Upload failed');
        } finally {
            setUploading(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            shippingFee: Number(formData.shippingFee),
            freeShippingThreshold: Number(formData.freeShippingThreshold),
            socialLinks: {
                instagram: formData.instagram,
                facebook: formData.facebook,
                twitter: formData.twitter,
                tiktok: formData.tiktok
            }
        };
        const result = await updateSettings(payload);
        if (result.success) {
            setIsSaved(true);
            toast.success('Settings saved!');
            setTimeout(() => setIsSaved(false), 3000);
        } else {
            toast.error(result.message || 'Failed to save');
        }
    };

    const ImageSection = ({ label, field, mode, setMode, uploadKey }) => (
        <div className="space-y-3">
            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">{label}</label>
            {/* Mode Toggle */}
            <div className="flex border border-white/10 p-0.5 w-fit">
                <button type="button" onClick={() => setMode('url')}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${mode === 'url' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                    <LinkIcon size={10} /> URL
                </button>
                <button type="button" onClick={() => setMode('upload')}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${mode === 'upload' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                    <Upload size={10} /> Upload
                </button>
            </div>
            {mode === 'url' ? (
                <input type="text" name={field} value={formData[field]} onChange={handleChange}
                    className="admin-input" placeholder="https://example.com/image.jpg" />
            ) : (
                <label className={`flex items-center justify-center gap-2 border border-dashed h-20 cursor-pointer transition-all text-xs font-bold uppercase tracking-wider ${uploading[uploadKey] ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-white/10 text-gray-600 hover:border-white/30'}`}>
                    {uploading[uploadKey] ? (
                        <><div className="spinner w-4 h-4" /> Uploading...</>
                    ) : formData[field] ? (
                        <><Upload size={14} /> Replace Image</>
                    ) : (
                        <><Upload size={14} /> Choose from Device</>
                    )}
                    <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => handleImageUpload(field, e.target.files[0])}
                        disabled={uploading[uploadKey]} />
                </label>
            )}
            {formData[field] && (
                <div className="h-24 bg-black border border-white/5 overflow-hidden">
                    <img src={formData[field]} alt={label} className="w-full h-full object-cover opacity-60" />
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <h1 className="text-2xl font-black uppercase text-white tracking-wider">Global Settings</h1>
                <button
                    onClick={handleSubmit}
                    disabled={loading || isSaved}
                    className={`flex items-center gap-2 px-6 py-2.5 font-black uppercase tracking-wider text-xs transition-all ${isSaved ? 'bg-green-500 text-black' : 'btn-primary'} disabled:opacity-50`}
                >
                    {loading ? <><Loader2 size={14} className="animate-spin" /> Saving...</> :
                        isSaved ? <><CheckCircle size={14} /> Saved!</> :
                            <><Save size={14} /> Save Settings</>}
                </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* General */}
                <div className="bg-[#111] p-6 border border-white/5 space-y-4">
                    <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-3">General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Site Name</label>
                            <input type="text" name="siteName" value={formData.siteName} onChange={handleChange} className="admin-input" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">SEO Description</label>
                            <textarea name="siteDescription" value={formData.siteDescription} onChange={handleChange} rows={2} className="admin-input resize-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Contact Email</label>
                            <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="admin-input" />
                        </div>
                    </div>
                </div>

                {/* Logo & Banner */}
                <div className="bg-[#111] p-6 border border-white/5 space-y-6">
                    <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-3">Logo & Hero Banner</h2>
                    <ImageSection label="Site Logo" field="logoUrl" mode={logoMode} setMode={setLogoMode} uploadKey="logo" />
                    <ImageSection label="Hero Banner Image" field="heroBannerUrl" mode={bannerMode} setMode={setBannerMode} uploadKey="banner" />
                </div>

                {/* Hero Content */}
                <div className="bg-[#111] p-6 border border-white/5 space-y-4">
                    <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-3">Hero Section</h2>
                    <div>
                        <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Hero Headline (Use Enter for 2nd line split)</label>
                        <textarea name="heroTitle" value={formData.heroTitle} onChange={handleChange} rows={2} className="admin-input resize-none" placeholder="e.g. STREETWEAR&#10;COLLECTION" />
                        <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider">The first line will be solid, the second will be outlined.</p>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Hero Subtitle</label>
                        <textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} rows={2} className="admin-input resize-none" />
                    </div>
                </div>

                {/* Shipping */}
                <div className="bg-[#111] p-6 border border-white/5 space-y-4">
                    <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-3">Shipping Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Shipping Fee (Rs.)</label>
                            <input type="number" name="shippingFee" value={formData.shippingFee} onChange={handleChange} className="admin-input" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Free Shipping Threshold (Rs.)</label>
                            <input type="number" name="freeShippingThreshold" value={formData.freeShippingThreshold} onChange={handleChange} className="admin-input" />
                        </div>
                    </div>
                </div>

                {/* Social */}
                <div className="bg-[#111] p-6 border border-white/5 space-y-4">
                    <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] border-b border-white/5 pb-3">Social Media</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['instagram', 'facebook', 'tiktok', 'twitter'].map(s => (
                            <div key={s}>
                                <label className="block text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">{s}</label>
                                <input type="url" name={s} value={formData[s]} onChange={handleChange} className="admin-input" placeholder={`https://${s}.com/thrivvstudio`} />
                            </div>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Settings;
