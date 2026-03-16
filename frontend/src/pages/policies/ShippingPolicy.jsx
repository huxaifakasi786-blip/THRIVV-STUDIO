import React from 'react';
import { Link } from 'react-router-dom';
import useSettingsStore from '../../store/settingsStore';

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

const ShippingPolicy = () => {
    const { settings, fetchSettings } = useSettingsStore();

    React.useEffect(() => {
        if (!settings) fetchSettings();
    }, [settings, fetchSettings]);

    const shippingFee = settings?.shippingFee || 300;
    const freeThreshold = settings?.freeShippingThreshold || 5000;

    return (
        <PolicyLayout title="Shipping Policy" lastUpdated="March 2024">
            <section>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Order Processing Times</h2>
                <p>
                    All orders are processed within 1 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
                </p>
                <p className="mt-4">
                    Please note that during high-volume drops or promotional periods, processing times may be extended by 2-3 additional business days.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Domestic Shipping Rates</h2>
                <div className="bg-[#111] border border-white/10 rounded overflow-hidden mt-6">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4 font-bold border-b border-white/10">Shipping Method</th>
                                <th className="px-6 py-4 font-bold border-b border-white/10">Estimated Delivery</th>
                                <th className="px-6 py-4 font-bold border-b border-white/10 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">Standard Shipping</td>
                                <td className="px-6 py-4">3-5 Business Days</td>
                                <td className="px-6 py-4 text-right">Rs. {shippingFee} (Free over Rs. {freeThreshold.toLocaleString()})</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">Express Shipping</td>
                                <td className="px-6 py-4">1-2 Business Days</td>
                                <td className="px-6 py-4 text-right">Rs. 500</td>
                            </tr>
                            <tr className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold text-[var(--color-accent)]">Cash on Delivery (COD)</td>
                                <td className="px-6 py-4">3-5 Business Days</td>
                                <td className="px-6 py-4 text-right">Rs. {shippingFee} Flat Rate</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">International Shipping</h2>
                <p>
                    Currently, we primarily ship domestically. However, select international locations are available at checkout. International shipping rates are calculated dynamically at checkout based on weight and destination. Your order may be subject to import duties and taxes, which are incurred once a shipment reaches your destination country. We are not responsible for these charges if they are applied and are your responsibility as the customer.
                </p>
            </section>
        </PolicyLayout>
    );
};

export default ShippingPolicy;
