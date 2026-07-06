import { useState, useEffect } from 'react';

const translationCache = {};

function TranslatedText({ text, toLang, isExpanded = true, maxWords = 50 }) {
    const [translated, setTranslated] = useState(text);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!text) {
            setTranslated('');
            return;
        }

        // Default language in DB is French
        if (toLang === 'fr') {
            setTranslated(text);
            return;
        }

        const cacheKey = `${toLang}:${text}`;
        if (translationCache[cacheKey]) {
            setTranslated(translationCache[cacheKey]);
            return;
        }

        let isMounted = true;
        const performTranslation = async () => {
            setLoading(true);
            try {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=${toLang}&dt=t&q=${encodeURIComponent(text)}`;
                const res = await fetch(url);
                if (res.ok) {
                    const json = await res.json();
                    if (json && json[0]) {
                        const result = json[0].map(item => item[0]).join('');
                        translationCache[cacheKey] = result;
                        if (isMounted) {
                            setTranslated(result);
                        }
                    }
                }
            } catch (err) {
                console.error("Dynamic translation failed:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        performTranslation();

        return () => {
            isMounted = false;
        };
    }, [text, toLang]);

    // Handle word-based truncation if not expanded
    const words = translated ? translated.split(/\s+/) : [];
    const isLong = words.length > maxWords;
    const displayText = isLong && !isExpanded 
        ? words.slice(0, maxWords).join(' ') + '...' 
        : translated;

    if (loading) {
        return <span className="opacity-70 animate-pulse">{displayText}</span>;
    }

    return <span>{displayText}</span>;
}

export default TranslatedText;
