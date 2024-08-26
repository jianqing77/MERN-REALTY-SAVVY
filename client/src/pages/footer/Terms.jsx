import React from 'react';

export default function Terms() {
    return (
        <div className="max-w-4xl mx-auto pt-10 pb-20 text-gray-800">
            <h1 className="text-3xl font-bold mb-10 mt-12 text-center">
                Terms and Conditions
            </h1>
            <p>
                Welcome to Realty Savvy! These Terms and Conditions govern your use of our
                website and services. By accessing Realty Savvy, you agree to be bound by
                these Terms and Conditions and our Privacy Policy. If you do not agree to
                these terms, please do not use our services.
            </p>
            <h2 className="text-2xl font-semibold mt-5 mb-3">User Accounts</h2>
            <ul className="list-disc pl-5 space-y-2 rounded-lg">
                <li>
                    Registration: Users must register an account to access certain
                    features of Realty Savvy. You must provide accurate and complete
                    information and keep your account information updated.
                </li>
                <li>
                    {' '}
                    Security: You are responsible for maintaining the confidentiality of
                    your account password and for all activities that occur under your
                    account.
                </li>
                <li>
                    {' '}
                    Termination: Realty Savvy reserves the right to terminate your account
                    if you violate any terms herein.
                </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-5 mb-3">Use of the Site</h2>
            <p>
                You may use the site for personal, non-commercial purposes related to
                seeking real estate services. You may not use the site to engage in any
                unlawful activity, to infringe on the rights of others, or to disrupt the
                functionality of the site.
            </p>

            <h2 className="text-2xl font-semibold mt-5 mb-3">User Contributions</h2>
            <p>
                Users may post listings, reviews, and other content, as long as such
                content complies with all applicable laws and does not infringe on the
                rights of others. Realty Savvy has the right to remove any user content
                that violates these terms or is deemed inappropriate.
            </p>

            <h2 className="text-2xl font-semibold mt-5 mb-3">Accuracy of Information</h2>
            <p>
                Realty Savvy does not guarantee the accuracy, completeness, or timeliness
                of information on the site. Users are responsible for confirming any
                information before relying on it.
            </p>

            <h2 className="text-2xl font-semibold mt-5 mb-3">Third-Party Links</h2>
            <p>
                Realty Savvy may include links to third-party websites. These links are
                provided for your convenience and do not signify our endorsement of such
                websites or their content.
            </p>

            <h2 className="text-2xl font-semibold mt-5 mb-3">Intellectual Property</h2>
            <p>
                All content on Realty Savvy, including text, graphics, logos, and images,
                is the property of Realty Savvy or its content suppliers and protected by
                international copyright and trademark laws.
            </p>

            <h2 className="text-2xl font-semibold mt-5 mb-3">Limitation of Liability</h2>
            <p>
                Realty Savvy shall not be liable for any damages arising out of your use
                of the website or your reliance on any information provided on the site.
            </p>
            <h2 className="text-2xl font-semibold mt-5 mb-3">Changes to Terms</h2>
            <p>
                Realty Savvy reserves the right to modify these Terms at any time. We will
                post the revised Terms on the site, and they will become effective
                immediately upon posting.
            </p>

            <h2 className="text-2xl font-semibold mt-5 mb-3">Contact Us</h2>
            <p>
                If you have any questions about these Terms, please contact us at{' '}
                <a
                    href="mailto:contact@realtysavvy.com"
                    className="text-blue-500 hover:text-blue-700">
                    contact@realtysavvy.com
                </a>
                .
            </p>
        </div>
    );
}
