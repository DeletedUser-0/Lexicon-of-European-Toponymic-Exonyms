function convertToponym() {
  const input = document.getElementById("inputToponym").value.trim();
  const mode = document.getElementById("mode").value;
  const lang = document.getElementById("targetLang").value;
  const resultDiv = document.getElementById("result");

  if (!input) {
    resultDiv.innerText = "Please enter a toponym.";
    return;
  }

  let result;

  switch (mode) {
    case "translate":
      result = advancedExonymResolution(input, lang);
      break;
    case "phonetic":
    case "create": // treat 'create' as 'phonetic' for now
      result = advancedPhoneticAdaptation(input, lang);
      break;
    default:
      result = "Unknown mode.";
  }

  const ipa = mockIPA(result, lang);
  resultDiv.innerHTML = `<strong>${result}</strong><br><em>IPA:</em> ${ipa}`;
}

// Enhanced Translation using hierarchical exonym resolution
function advancedExonymResolution(name, lang) {
  const exonyms = {
    "München": { en: "Munich", fr: "Munich", pt: "Munique", nl: "München", de: "München" },
    "Lisboa": { en: "Lisbon", fr: "Lisbienne", de: "Lissabon", nl: "Lissabon", pt: "Lisboa" },
    "Wien": { en: "Vienna", fr: "Vienne", de: "Wien", pt: "Viena", nl: "Wenen" }
  };

  const entry = exonyms[name];
  if (entry && entry[lang]) {
    return entry[lang];
  }

  // Fallback: transform name with common suffix pattern
  const suffixMap = {
    de: "burg",
    fr: "ville",
    pt: "cidade",
    nl: "dam",
    en: "town"
  };
  const suffix = suffixMap[lang] || "town";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() + suffix;
}

// Advanced Phonetic Adaptation using simplified phoneme mapping
function advancedPhoneticAdaptation(name, lang) {
  let phonetic = name.toLowerCase();

  const rulesByLang = {
    de: [
      [/gn/g, 'n'],         // French 'gn' → German 'n'
      [/ou/g, 'au'],        // maintain existing rules
      [/ai/g, 'ei'],
      [/x/g, 'chs'],
      [/c(?=[eéií])/g, 'z'],
      [/c/g, 'k'],
      [/qu/g, 'kw'],
      [/ph/g, 'f'],
      [/y/g, 'ü'],
      [/e$/g, 'en'],        // French final 'e' becomes 'en' or drops
      [/^bo/g, 'boll'],     // Optional: 'Bo' → 'Boll' for strong consonant start
      [/([aeiou])s$/g, '$1s'], // Final 's' after vowel remains
      [/([aeiou])s([aeiou])/g, '$1z$2'], // Intervocalic 's' becomes 'z'
      [/([aeiou])ss([aeiou])/g, '$1ß$2'], // Intervocalic 'ss' becomes 'ß'
      [/ss$/g, 'ß'] // Final 'ss' becomes 'ß'
    ],
    fr: [
      [/k/g, 'qu'],
      [/w/g, 'ou'],
      [/sh/g, 'ch'],
      [/z/g, 's'],
      [/c(?=[eéií])/g, 's'],
      [/c/g, 'k'],
      [/qu/g, 'k'],
      [/ph/g, 'f'],
      [/y/g, 'i'],
      [/j/g, 'j'],
      [/([aeiou])s$/g, '$1s'], // Final 's' after vowel remains
      [/([aeiou])s([aeiou])/g, '$1z$2'], // Intervocalic 's' becomes 'z'
      [/([aeiou])ss([aeiou])/g, '$1s$2'], // Intervocalic 'ss' remains
      [/ss$/g, 's'] // Final 'ss' remains
    ],
    pt: [
      [/j/g, 'j'],
      [/sh/g, 'ch'],
      [/w/g, 'u'],
      [/c(?=[eéií])/g, 's'],
      [/c/g, 'k'],
      [/qu/g, 'kw'],
      [/ph/g, 'f'],
      [/y/g, 'i'],
      [/([aeiou])s$/g, '$1s'], // Final 's' after vowel remains
      [/([aeiou])s([aeiou])/g, '$1z$2'], // Intervocalic 's' becomes 'z'
      [/([aeiou])ss([aeiou])/g, '$1s$2'], // Intervocalic 'ss' remains
      [/ss$/g, 's'] // Final 'ss' remains
    ],
    nl: [
      [/sh/g, 'sch'],
      [/ou/g, 'oe'],
      [/w/g, 'w'],
      [/ch/g, 'g'],
      [/c(?=[eéií])/g, 's'],
      [/c/g, 'k'],
      [/qu/g, 'kw'],
      [/ph/g, 'f'],
      [/y/g, 'i'],
      [/([aeiou])s$/g, '$1s'], // Final 's' after vowel remains
      [/([aeiou])s([aeiou])/g, '$1z$2'], // Intervocalic 's' becomes 'z'
      [/([aeiou])ss([aeiou])/g, '$1s$2'], // Intervocalic 'ss' remains
      [/ss$/g, 's'] // Final 'ss' remains
    ],
    en: [
      [/ü/g, 'u'],
      [/ö/g, 'oe'],
      [/ä/g, 'ae'],
      [/ß/g, 'ss'],
      [/ch/g, 'k'],
      [/c(?=[eéií])/g, 's'],
      [/c/g, 'k'],
      [/qu/g, 'kw'],
      [/ph/g, 'f'],
      [/y/g, 'i'],
      [/([aeiou])s$/g, '$1s'], // Final 's' after vowel remains
      [/([aeiou])s([aeiou])/g, '$1z$2'], // Intervocalic 's' becomes 'z'
      [/([aeiou])ss([aeiou])/g, '$1s$2'], // Intervocalic 'ss' remains
      [/ss$/g, 's'] // Final 'ss' remains
    ]
  };

  const langRules = rulesByLang[lang] || [];
  langRules.forEach(([pattern, replacement]) => {
    phonetic = phonetic.replace(pattern, replacement);
  });

  return phonetic.charAt(0).toUpperCase() + phonetic.slice(1);
}

function mockIPA(name, lang) {
  const ipaMap = {
    de: name
      .replace(/ch/g, 'x')
      .replace(/ei/g, 'aɪ')
      .replace(/ie/g, 'iː')
      .replace(/au/g, 'aʊ')
      .replace(/z/g, 'ts')
      .replace(/w/g, 'v'),
    fr: name
      .replace(/ch/g, 'ʃ')
      .replace(/ou/g, 'u')
      .replace(/ill/g, 'ij')
      .replace(/gn/g, 'ɲ'),
    pt: name
      .replace(/ão/g, 'ɐ̃w̃')
      .replace(/nh/g, 'ɲ')
      .replace(/lh/g, 'ʎ')
      .replace(/rr/g, 'ʁ'),
    nl: name
      .replace(/oe/g, 'u')
      .replace(/ui/g, 'œy')
      .replace(/sch/g, 'sx')
      .replace(/ij/g, 'ɛi'),
    en: name
      .replace(/th/g, 'θ')
      .replace(/sh/g, 'ʃ')
      .replace(/ph/g, 'f')
      .replace(/ough/g, 'ʌf')
  };

  const ipa = ipaMap[lang] || name;
  return `/${ipa.toLowerCase()}/`;
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("convertButton").addEventListener("click", convertToponym);
});