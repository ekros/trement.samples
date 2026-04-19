"use client";

const getFinalText = (text: string, lang: string) => {
  const parts = text.split(';;');
  for (const part of parts) {
    const [key, value] = part.split('::');
    if (key.trim() === lang) {
      return value.trim();
    }
  }
  return text;
}

export function parseMultiLingualText(text: any, lang: string = 'en'): string {
  console.log("Parsing multilingual text:", { text, lang });
  if (text && typeof text === 'object') {
    text.children[0].children[0].text = getFinalText(text.children[0].children[0].text, lang);
    return text;
  } else if (typeof text === 'string') {
    return getFinalText(text, lang);
  }

  return text;
}

export function setLanguage(lang: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
    location.reload(); // reload the page to apply the new language
  }
}

export function getLanguage() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language');
  }
}