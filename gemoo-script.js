(() => {
    'use strict';

    const GEMOO_CONFIG = {
        defaultLanguage: 'en',
        qrTargetUrl: 'https://gemo02011.github.io/my-portfolio',
        qrSize: 150,
        animationClass: 'gemoo-ready',
        animatedItemClass: 'gemoo-animate-item',
        activeClass: 'active'
    };

    const GEMOO_TRANSLATIONS = {
        en: {
            htmlLang: 'en',
            direction: 'ltr',
            title: 'Gemoo | Digital Product Design Brand',
            brand: 'Gemoo',
            hero: {
                eyebrow: 'Digital Product Design Brand',
                name: 'Gemoo',
                tagline: 'Designing Products That Grow.',
                description: 'Digital Product Design Brand creating intuitive, scalable, and meaningful digital experiences.'
            },
            sections: {
                explore: 'Explore',
                linksTitle: 'Gemoo Links',
                scan: 'Scan',
                qrTitle: 'Connect with Gemoo'
            },
            qrText: 'Scan to access all Gemoo links.',
            links: {
                portfolio: 'Portfolio',
                behance: 'Behance',
                linkedin: 'LinkedIn',
                email: 'Email',
                whatsapp: 'WhatsApp',
                instagram: 'Instagram',
                tiktok: 'TikTok',
                twitter: 'Twitter (X)'
            },
            aria: {
                languageGroup: 'Language selector',
                englishButton: 'Switch language to English',
                arabicButton: 'Switch language to Arabic',
                qrCode: 'QR code for Gemoo links'
            }
        },
        ar: {
            htmlLang: 'ar',
            direction: 'rtl',
            title: 'جيمو | علامة لتصميم المنتجات الرقمية',
            brand: 'جيمو',
            hero: {
                eyebrow: 'علامة لتصميم المنتجات الرقمية',
                name: 'جيمو',
                tagline: 'نصمم منتجات قابلة للنمو.',
                description: 'علامة متخصصة في تصميم المنتجات الرقمية، تصنع تجارب واضحة وقابلة للتوسع وذات معنى.'
            },
            sections: {
                explore: 'استكشف',
                linksTitle: 'روابط جيمو',
                scan: 'امسح',
                qrTitle: 'تواصل مع جيمو'
            },
            qrText: 'امسح للوصول إلى جميع روابط جيمو.',
            links: {
                portfolio: 'بورتفوليو',
                behance: 'بيهانس',
                linkedin: 'لينكدإن',
                email: 'البريد',
                whatsapp: 'واتساب',
                instagram: 'إنستجرام',
                tiktok: 'تيك توك',
                twitter: 'تويتر (X)'
            },
            aria: {
                languageGroup: 'اختيار اللغة',
                englishButton: 'تغيير اللغة إلى الإنجليزية',
                arabicButton: 'تغيير اللغة إلى العربية',
                qrCode: 'رمز QR لروابط جيمو'
            }
        }
    };

    const LINK_KEY_ALIASES = {
        portfolio: 'portfolio',
        behance: 'behance',
        linkedin: 'linkedin',
        email: 'email',
        whatsapp: 'whatsapp',
        instagram: 'instagram',
        tiktok: 'tiktok',
        'tik-tok': 'tiktok',
        twitter: 'twitter',
        x: 'twitter',
        'twitter-x': 'twitter'
    };

    const getElement = (selector, parent = document) => parent.querySelector(selector);
    const getElements = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    const setText = (element, value) => {
        if (!element || typeof value !== 'string' || element.textContent === value) return;
        element.textContent = value;
    };

    const setAttribute = (element, attribute, value) => {
        if (!element || element.getAttribute(attribute) === value) return;
        element.setAttribute(attribute, value);
    };

    const normalizeKey = (value = '') => {
        return value
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\(.*?\)/g, '')
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const resolveLinkKey = (element) => {
        const explicitKey = normalizeKey(element.dataset.key);
        const englishKey = normalizeKey(element.dataset.en);
        const currentTextKey = normalizeKey(element.textContent);

        return (
            LINK_KEY_ALIASES[explicitKey] ||
            LINK_KEY_ALIASES[englishKey] ||
            LINK_KEY_ALIASES[currentTextKey] ||
            englishKey ||
            currentTextKey
        );
    };

    const createDomCache = () => ({
        root: document.documentElement,
        body: document.body,
        languageSwitcher: getElement('.gemoo-language'),
        englishButton: getElement('#gemoo-lang-en'),
        arabicButton: getElement('#gemoo-lang-ar'),
        brandText: getElement('.gemoo-brand span'),
        heroEyebrow: getElement('.gemoo-eyebrow'),
        heroName: getElement('#gemoo-name'),
        heroTitle: getElement('#gemoo-title'),
        heroDescription: getElement('.gemoo-description'),
        sectionKickers: getElements('.gemoo-section-kicker'),
        linksTitle: getElement('#gemoo-links-title'),
        qrTitle: getElement('#gemoo-qr-title'),
        qrText: getElement('#gemoo-qr-text'),
        qrCode: getElement('#gemoo-qrcode'),
        linkTexts: getElements('.gemoo-link-text'),
        animatedElements: getElements('.gemoo-hero, .gemoo-link-card, .gemoo-qr, .gemoo-social-section, .gemoo-footer')
    });

    const initializeQRCode = ({ qrCode }) => {
        if (!qrCode || typeof window.QRCode !== 'function') return;

        qrCode.replaceChildren();

        new window.QRCode(qrCode, {
            text: GEMOO_CONFIG.qrTargetUrl,
            width: GEMOO_CONFIG.qrSize,
            height: GEMOO_CONFIG.qrSize,
            colorDark: '#0F172A',
            colorLight: '#FFFFFF',
            correctLevel: window.QRCode.CorrectLevel.H
        });

        qrCode.dataset.qrReady = 'true';
    };

    const updateLanguageMetadata = ({ root }, translation) => {
        setAttribute(root, 'lang', translation.htmlLang);
        setAttribute(root, 'dir', translation.direction);

        if (document.title !== translation.title) {
            document.title = translation.title;
        }
    };

    const updateLanguageControls = (elements, language, translation) => {
        const { languageSwitcher, englishButton, arabicButton } = elements;

        setAttribute(languageSwitcher, 'aria-label', translation.aria.languageGroup);
        setAttribute(englishButton, 'aria-label', translation.aria.englishButton);
        setAttribute(arabicButton, 'aria-label', translation.aria.arabicButton);

        englishButton?.classList.toggle(GEMOO_CONFIG.activeClass, language === 'en');
        arabicButton?.classList.toggle(GEMOO_CONFIG.activeClass, language === 'ar');

        setAttribute(englishButton, 'aria-pressed', String(language === 'en'));
        setAttribute(arabicButton, 'aria-pressed', String(language === 'ar'));
    };

    const updatePageContent = (elements, translation) => {
        setText(elements.brandText, translation.brand);
        setText(elements.heroEyebrow, translation.hero.eyebrow);
        setText(elements.heroName, translation.hero.name);
        setText(elements.heroTitle, translation.hero.tagline);
        setText(elements.heroDescription, translation.hero.description);
        setText(elements.linksTitle, translation.sections.linksTitle);
        setText(elements.qrTitle, translation.sections.qrTitle);
        setText(elements.qrText, translation.qrText);
        setAttribute(elements.qrCode, 'aria-label', translation.aria.qrCode);

        if (elements.sectionKickers[0]) {
            setText(elements.sectionKickers[0], translation.sections.explore);
        }

        if (elements.sectionKickers[1]) {
            setText(elements.sectionKickers[1], translation.sections.scan);
        }

        elements.linkTexts.forEach((element) => {
            const linkKey = resolveLinkKey(element);
            const translatedText = translation.links[linkKey];

            if (translatedText) {
                setText(element, translatedText);
            }
        });
    };

    const setLanguage = (language, elements) => {
        const translation = GEMOO_TRANSLATIONS[language] || GEMOO_TRANSLATIONS[GEMOO_CONFIG.defaultLanguage];

        updateLanguageMetadata(elements, translation);
        updateLanguageControls(elements, language, translation);
        updatePageContent(elements, translation);

        try {
            window.localStorage.setItem('gemoo-language', language);
        } catch {
            return;
        }
    };

    const getInitialLanguage = () => {
        try {
            const savedLanguage = window.localStorage.getItem('gemoo-language');

            if (savedLanguage && GEMOO_TRANSLATIONS[savedLanguage]) {
                return savedLanguage;
            }
        } catch {
            return GEMOO_CONFIG.defaultLanguage;
        }

        const browserLanguage = window.navigator.language?.slice(0, 2);

        return GEMOO_TRANSLATIONS[browserLanguage]
            ? browserLanguage
            : GEMOO_CONFIG.defaultLanguage;
    };

    const initializeLanguageSwitcher = (elements) => {
        const { languageSwitcher } = elements;

        if (!languageSwitcher) return;

        languageSwitcher.addEventListener('click', (event) => {
            const button = event.target.closest('button');

            if (!button || !languageSwitcher.contains(button)) return;

            if (button.id === 'gemoo-lang-en') {
                setLanguage('en', elements);
                return;
            }

            if (button.id === 'gemoo-lang-ar') {
                setLanguage('ar', elements);
            }
        });
    };

    const initializeEntranceMotion = ({ body, animatedElements }) => {
        if (!body || !animatedElements.length) return;

        animatedElements.forEach((element, index) => {
            element.classList.add(GEMOO_CONFIG.animatedItemClass);
            element.style.setProperty('--gemoo-animation-order', index);
        });

        window.requestAnimationFrame(() => {
            body.classList.add(GEMOO_CONFIG.animationClass);
        });
    };

    const initializeExternalLinks = () => {
        getElements('a[target="_blank"]').forEach((link) => {
            const relValues = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));

            relValues.add('noopener');
            relValues.add('noreferrer');

            setAttribute(link, 'rel', [...relValues].join(' '));
        });
    };

    const initializeGemoo = () => {
        const elements = createDomCache();

        initializeExternalLinks();
        initializeQRCode(elements);
        initializeLanguageSwitcher(elements);
        setLanguage(getInitialLanguage(), elements);
        initializeEntranceMotion(elements);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGemoo, { once: true });
    } else {
        initializeGemoo();
    }
})();
