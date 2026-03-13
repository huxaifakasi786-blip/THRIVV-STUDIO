import React from 'react';
import { Link } from 'react-router-dom';

const PolicyLayout = ({ title, lastUpdated, children }) => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-4xl">
        <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                {title}
            </h1>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
                Last Updated: {lastUpdated}
            </p>
        </div>
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 space-y-8">
            {children}
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 mb-6 font-medium">Have questions? We're here to help.</p>
            <Link to="/contact" className="btn-outline px-8 uppercase tracking-widest text-sm inline-block">
                Contact Support
            </Link>
        </div>
    </div>
);

const TermsOfService = () => {
    return (
        <PolicyLayout title="Terms of Service" lastUpdated="March 2024">
            <section>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">1. Acceptance of Terms</h2>
                <p>
                    By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">2. Intellectual Property Rights</h2>
                <p>
                    Under these Terms, the Company and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website. Any unauthorized reproduction, distribution, or derivative use of the brand assets, clothing artwork, or website design is strictly prohibited.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">3. User Responsibilities</h2>
                <p>
                    You are specifically restricted from all of the following:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                    <li>Publishing any Website material in any other media without prior consent.</li>
                    <li>Selling, sublicensing and/or otherwise commercializing any Website material.</li>
                    <li>Using this Website in any way that is or may be damaging to this Website.</li>
                    <li>Using this Website in any way that impacts user access to this Website.</li>
                    <li>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity.</li>
                </ul>
            </section>
        </PolicyLayout>
    );
};

export default TermsOfService;
