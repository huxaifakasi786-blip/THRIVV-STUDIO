import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';
import useSettingsStore from '../../store/settingsStore';
import API from '../../api/axios';

const LogoSettings = () => {
    const { settings, fetchSettings, updateSettings, loading } = useSettingsStore();
    const [logoUrl, setLogoUrl] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const [imageMode, setImageMode] = useState('url'); // 'url' | 'upload'
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    useEffect(() => {
        if (settings) {
            setLogoUrl(settings.logoUrl || '');
        }
    }, [settings]);

    const handleFileUpload = async (file) => {
        if (!file) return;
        setIsUploadingImage(true);
        try {
            const fd = new FormData();
            fd.append('image', file);

            const { data } = await API.post('/upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setLogoUrl(data.url);
            setIsSaved(false);
        } catch (err) {
            alert('Upload failed. Try a URL instead.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSave = async () => {
        const result = await updateSettings({ logoUrl });
        if (result.success) {
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="max-w-4xl max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white mb-8 border-b border-white/10 pb-4">
                Logo Management
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Upload Section */}
                <div className="bg-[#111] p-6 rounded-lg border border-white/5">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                        <ImageIcon className="w-5 h-5 mr-3 text-[var(--color-accent)]" />
                        Logo Configuration
                    </h2>

                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                        Choose your site logo. Recommended: SVG or transparent PNG.
                    </p>

                    <div className="flex gap-2 mb-6">
                        <button
                            type="button"
                            onClick={() => setImageMode('url')}
                            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${imageMode === 'url' ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'border-white/10 text-gray-500 hover:text-white'}`}
                        >
                            Link URL
                        </button>
                        <button
                            type="button"
                            onClick={() => setImageMode('upload')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${imageMode === 'upload' ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'border-white/10 text-gray-500 hover:text-white'}`}
                        >
                            <Upload size={14} /> Device
                        </button>
                    </div>

                    <div className="space-y-4 mb-6">
                        {imageMode === 'url' ? (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Logo Image URL</label>
                                <input
                                    type="text"
                                    value={logoUrl}
                                    onChange={(e) => {
                                        setLogoUrl(e.target.value);
                                        setIsSaved(false);
                                    }}
                                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                                    placeholder="https://example.com/logo.svg"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className={`flex items-center justify-center gap-2 border border-dashed cursor-pointer py-6 transition-all text-xs font-bold uppercase tracking-wider ${isUploadingImage ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-white/10 text-gray-500 hover:border-white/30 hover:text-white'}`}>
                                    {isUploadingImage ? (
                                        <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Uploading...</>
                                    ) : (
                                        <><Upload size={16} /> Choose Image File</>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileUpload(e.target.files[0])}
                                        disabled={isUploadingImage}
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading || isSaved}
                        className={`w-full py-4 text-sm font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center ${isSaved
                            ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                            : logoUrl
                                ? 'btn-primary'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {loading ? (
                            <><Loader2 size={18} className="mr-2 animate-spin" /> Updating...</>
                        ) : isSaved ? (
                            <><CheckCircle size={18} className="mr-2" /> Saved Successfully</>
                        ) : (
                            'Save & Update Website'
                        )}
                    </button>
                </div>

                {/* Preview Section */}
                <div className="bg-[#111] p-6 rounded-lg border border-white/5">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/10">Header Preview</h2>

                    <div className="bg-black/50 rounded-lg p-6 border border-gray-800 mb-6">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Current Appearance</p>

                        {/* Mock Header Context */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded overflow-hidden shadow-2xl">
                            <div className="h-16 px-4 flex items-center justify-between border-b mx-auto">
                                <div className="flex-shrink-0">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo Preview" className="h-8 object-contain" onError={(e) => e.target.style.display = 'none'} />
                                    ) : (
                                        <div className="text-xl font-black tracking-tighter text-white">
                                            <span className="text-[var(--color-accent)]">THRIVV</span>STUDIO
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-4 opacity-50">
                                    <div className="w-12 h-2 bg-gray-700 rounded blur-[1px]"></div>
                                    <div className="w-12 h-2 bg-gray-700 rounded blur-[1px]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!logoUrl && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4 text-yellow-500 text-sm">
                            Currently using text-based logo fallback. Provide a URL to replace it.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default LogoSettings;
