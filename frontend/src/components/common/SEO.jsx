import { useEffect } from 'react';

const SEO = ({ title, description, keywords }) => {
    useEffect(() => {
        // Update Title
        const baseTitle = 'THRIVV STUDIO';
        document.title = title ? `${title} | ${baseTitle}` : `${baseTitle} | Premium Urban Streetwear`;

        // Update Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description || 'Premium urban streetwear for the bold and fearless. Shop the latest hoodies, t-shirts, and accessories at Thrivv Studio.');

        // Update Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', keywords || 'streetwear, fashion, hoodies, t-shirts, pakistan, thrivv studio');

        // Note: For OpenGraph/Twitter, we could also update them here if needed
    }, [title, description, keywords]);

    return null; // This component doesn't render anything
};

export default SEO;
