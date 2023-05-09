import { ThemeEmotionMap, TypographyHTMLTag } from "~/types";
import { WebinyTheme } from "~/themes/webinyLexicalTheme";
import { createThemeStyleClassSuffixName } from "~/utils/createThemeStyleClassSuffixName";

/*
 *  Creates a map of style key ID's and typography style objects that include 'className' property which contains the
 *  CSS class name generated by the Emotion from typography styles object.
 */
export const toTypographyEmotionMap = (
    css: (cssStyle: Record<string, any>) => string,
    theme: WebinyTheme
): ThemeEmotionMap | {} => {
    const map: ThemeEmotionMap = {};
    const typographyStyles = theme.styles?.typography;
    if (!typographyStyles) {
        return {};
    }

    for (const key in typographyStyles) {
        const typographyTypeData = typographyStyles[key] as {
            id: string;
            tag: TypographyHTMLTag;
            name: string;
            styles: Record<string, any>;
        }[];
        if (typographyTypeData) {
            typographyTypeData.forEach(styleItem => {
                // 'lx' (abbreviation of lexical) variable will lead to generate shorter class names.
                // for example: instead of default 'css-181qz4b-453f345f'
                // the last segment will always end with 'lx' or 'css-181qz4b-lx'
                const lx = {
                    ...styleItem,
                    className:
                        [css(styleItem.styles)].filter(Boolean).join(" ") +
                        " " +
                        createThemeStyleClassSuffixName(styleItem.tag, "typography")
                };
                map[styleItem.id] = lx;
            });
        }
    }

    return map;
};
