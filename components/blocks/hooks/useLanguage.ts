import { getLanguage, setLanguage } from "@/lib/client-utils";

export function useLanguage(defaultLang: string = 'es') {
    let language = defaultLang;
    const storedLang = getLanguage();
    if (storedLang) {
        language = storedLang;
    } else if (typeof navigator !== 'undefined') {
        language = "es"; // TODO: hardcoded default
        setLanguage(language); // Store the detected language for future use
    }

    return language;
}