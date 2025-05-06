import { transliterate as tr } from "transliteration";

type GenerateSlugOptions = {
  lowercase?: boolean;
  separator?: string;
  replace?: Record<string, string>;
};

export function generateSlug(text: string, options: GenerateSlugOptions = {}) {
    const defaultOptions = {
        lowercase: true,
        separator: "-",
        replace: {
            "&": "and",
            "@": "at",
            "©": "c",
            "®": "r",
            "Æ": "ae",
            "ß": "ss",
            "·": "-",
            " ": "-",
            "ь": "",
            "ъ": ""
        },
    };

    // Создаем финальные опции с гарантированно заполненными полями
    const finalOptions = {
        lowercase: options.lowercase !== undefined ? options.lowercase : defaultOptions.lowercase,
        separator: options.separator || defaultOptions.separator,
        replace: {
            ...defaultOptions.replace,
            ...(options.replace || {}),
        },
    };

    let slug = tr(text, { unknown: finalOptions.separator });

    for (const [key, value] of Object.entries(finalOptions.replace)) {
        slug = slug.replace(new RegExp(escapeRegExp(key), "g"), value);
    }

    slug = slug.replace(/[^\w\-]+/g, "");

    slug = slug.replace(
        new RegExp(`\\${finalOptions.separator}+`, "g"),
        finalOptions.separator
    );

    // Удаление разделителей в начале и конце
    slug = slug.replace(
        new RegExp(
            `^\\${finalOptions.separator}|\\${finalOptions.separator}$`,
            "g"
        ),
        ""
    );

    // Приведение к нижнему регистру, если нужно
    if (finalOptions.lowercase) {
        slug = slug.toLowerCase();
    }

    return slug;
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}