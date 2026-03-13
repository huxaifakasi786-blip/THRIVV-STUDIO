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

const ReturnPolicy = () => {
    return (
        <PolicyLayout title="Return & Exchange Policy" lastUpdated="March 2024">
            <section>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Return Window</h2>
                <p className="text-gray-400">
                    THESE ALL PRODUCTS ARE NON REFUNDABLE AND NON RETURNABLE
                </p>
                
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider mt-8">Return Process</h2>
                <ol className="list-decimal pl-6 space-y-4 text-gray-400">
                    <li>Contact us at <a href="mailto:support@thrivv.com" className="text-[var(--color-accent)] hover:underline">support@thrivv.com</a> with your order number and reason for return.</li>
                </ol>
            </section>
        </PolicyLayout>
    );
};

export default ReturnPolicy;