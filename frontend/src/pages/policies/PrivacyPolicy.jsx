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

const PrivacyPolicy = () => {
    return (
        <PolicyLayout title="Privacy Policy" lastUpdated="March 2024">
            <section>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">1. Information We Collect</h2>
                <p>
                    We collect information that you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">2. How We Use Information</h2>
                <p>We may use the information we collect about you to:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                    <li>Provide, maintain, and improve our services, including facilitating payments, sending receipts, and providing products.</li>
                    <li>Perform internal operations necessary to provide our services.</li>
                    <li>Send you communications we think will be of interest to you, including information about products, services, promotions, and news.</li>
                    <li>Personalize and improve the services, including to provide or recommend features, content, social connections, referrals, and advertisements.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">3. Sharing of Information</h2>
                <p>
                    We will never sell or rent your personal information to third parties for their use without your consent. We may share information about you as described in this Statement or at the time of collection or sharing, including as follows:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                    <li>With third parties to provide you a service you requested through a partnership or promotional offering.</li>
                    <li>With vendors, consultants, marketing partners, and other service providers who need access to such information to carry out work on our behalf.</li>
                    <li>In response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process.</li>
                </ul>
            </section>
        </PolicyLayout>
    );
};

export default PrivacyPolicy;
