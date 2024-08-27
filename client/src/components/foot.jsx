import logoAvatar from '../assets/logo-rs-em.jpg';

const navigation = {
    main: [
        { name: 'About', href: '/about' },
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Press', href: '#' },
        { name: 'Accessibility', href: '#' },
        { name: 'Partners', href: '#' },
    ],
};
export default function foot() {
    return (
        <footer className="bg-dark-100">
            <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                <img className="h-10 mx-auto mb-8" src={logoAvatar} alt="company logo" />
                <nav
                    aria-label="Footer"
                    className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12">
                    {navigation.main.map((item) => (
                        <div key={item.name} className="pb-6">
                            <a
                                href={item.href}
                                className="text-sm leading-6 text-white hover:text-yellow-100">
                                {item.name}
                            </a>
                        </div>
                    ))}
                </nav>

                <p className="mt-10 text-center text-xs leading-5 text-white">
                    &copy; 2023 Realty Savvy, Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
