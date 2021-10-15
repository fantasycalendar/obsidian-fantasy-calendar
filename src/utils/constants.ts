export const DEFAULT_CATEGORY_COLOR = "#808080";

export const MOON_SHADOWS = [
    "M6.5,16a9.5,9.5 0 1,0 19,0a9.5,9.5 0 1,0 -19,0",
    "M19.79,6C22.25,7.2,25,9.92,25,16s-2.75,8.8-5.21,10a10.59,10.59,0,0,1-3.79.71A10.72,10.72,0,0,1,16,5.28,10.59,10.59,0,0,1,19.79,6Z",
    "M19.43,5.86C21.79,7,24.5,9.7,24.5,16s-2.71,9-5.07,10.14a10.55,10.55,0,0,1-3.43.58A10.72,10.72,0,0,1,16,5.28,10.55,10.55,0,0,1,19.43,5.86Z",
    "M17.87,5.46C20.23,6.34,24,8.88,24,16.17c0,6.85-3.33,9.36-5.69,10.29a11,11,0,0,1-2.31.26A10.72,10.72,0,0,1,16,5.28,10.49,10.49,0,0,1,17.87,5.46Z",
    "M17.79,5.45C20,6.3,23.5,8.77,23.5,15.88c0,7.37-3.75,9.87-5.95,10.71a9.92,9.92,0,0,1-1.55.13A10.72,10.72,0,0,1,16,5.28,10.54,10.54,0,0,1,17.79,5.45Z",
    "M17.35,5.38c1.9.79,5.15,3.25,5.15,10.72,0,7.25-3.06,9.68-5,10.5a10.87,10.87,0,0,1-1.52.12A10.72,10.72,0,0,1,16,5.28,10.1,10.1,0,0,1,17.35,5.38Z",
    "M17.05,5.34c1.6.75,4.45,3.17,4.45,10.79,0,7.39-2.68,9.76-4.3,10.52a11.9,11.9,0,0,1-1.2.07A10.72,10.72,0,0,1,16,5.28,9,9,0,0,1,17.05,5.34Z",
    "M16.85,5.33c1.3.74,3.65,3.12,3.65,10.67s-2.35,9.93-3.65,10.67c-.28,0-.56,0-.85,0A10.72,10.72,0,0,1,16,5.28,7.92,7.92,0,0,1,16.85,5.33Z",
    "M16.46,5.31c.95.78,3,3.34,3,10.69s-2.09,9.91-3,10.69l-.46,0A10.72,10.72,0,0,1,16,5.28Z",
    "M16.29,5.3c.65.8,2.21,3.48,2.21,10.78S17,25.91,16.3,26.7l-.3,0A10.72,10.72,0,0,1,16,5.28Z",
    "M16.13,5.29c.37.89,1.37,3.92,1.37,10.79s-1,9.76-1.36,10.63H16A10.72,10.72,0,0,1,16,5.28Z",
    "M16,5.29A85.5,85.5,0,0,1,16.5,16,85.5,85.5,0,0,1,16,26.71h0A10.72,10.72,0,0,1,16,5.28Z",
    "M16,26.72A10.72,10.72,0,0,1,16,5.28Z",
    "M15.5,16A85.59,85.59,0,0,0,16,26.72,10.72,10.72,0,0,1,16,5.28,85.59,85.59,0,0,0,15.5,16Z",
    "M14.5,16.08c0,6.84,1,9.77,1.36,10.63a10.71,10.71,0,0,1,0-21.42C15.5,6.17,14.5,9.2,14.5,16.08Z",
    "M15.7,26.7a10.7,10.7,0,0,1,0-21.4c-.65.8-2.21,3.47-2.21,10.78S15,25.92,15.7,26.7Z",
    "M15.55,26.7a10.71,10.71,0,0,1,0-21.4c-1,.78-3.05,3.34-3.05,10.7S14.6,25.92,15.55,26.7Z",
    "M15.16,26.68a10.71,10.71,0,0,1,0-21.36C13.85,6.06,11.5,8.43,11.5,16S13.85,25.94,15.16,26.68Z",
    "M14.81,26.65A10.72,10.72,0,0,1,15,5.33c-1.59.76-4.45,3.17-4.45,10.8C10.5,23.53,13.19,25.9,14.81,26.65Z",
    "M14.49,26.6a10.71,10.71,0,0,1,.17-21.23c-1.9.8-5.16,3.24-5.16,10.73C9.5,23.37,12.57,25.79,14.49,26.6Z",
    "M14.46,26.6a10.71,10.71,0,0,1-.24-21.16C12,6.29,8.5,8.76,8.5,15.88,8.5,23.26,12.27,25.76,14.46,26.6Z",
    "M13.72,26.47a10.71,10.71,0,0,1,.43-21C11.78,6.33,8,8.87,8,16.17,8,23,11.35,25.55,13.72,26.47Z",
    "M12.6,26.19a10.73,10.73,0,0,1,0-20.35C10.23,7,7.5,9.67,7.5,16s2.73,9,5.1,10.16Z",
    "M12.23,26a10.7,10.7,0,0,1,0-20C9.77,7.19,7,9.9,7,16S9.77,24.81,12.23,26Z",
    null,
    "M19.77,26C22.23,24.81,25,22.1,25,16S22.23,7.19,19.77,6a10.7,10.7,0,0,1,0,20Z",
    "M19.4,26.16C21.77,25,24.5,22.33,24.5,16S21.77,7,19.4,5.84a10.71,10.71,0,0,1,0,20.32Z",
    "M18.28,26.47C20.65,25.55,24,23,24,16.17c0-7.3-3.78-9.84-6.15-10.72a10.71,10.71,0,0,1,.43,21Z",
    "M17.54,26.6c2.19-.84,6-3.34,6-10.72,0-7.12-3.5-9.59-5.72-10.44a10.71,10.71,0,0,1-.24,21.16Z",
    "M17.51,26.6c1.92-.81,5-3.23,5-10.5,0-7.49-3.26-9.93-5.16-10.73a10.71,10.71,0,0,1,.17,21.23Z",
    "M17.19,26.65c1.62-.75,4.31-3.12,4.31-10.52,0-7.63-2.86-10-4.45-10.8a10.72,10.72,0,0,1,.14,21.32Z",
    "M16.84,26.68c1.31-.74,3.66-3.11,3.66-10.68S18.15,6.06,16.84,5.32a10.71,10.71,0,0,1,0,21.36Z",
    "M16.45,26.7c.95-.78,3.05-3.34,3.05-10.7S17.4,6.08,16.45,5.3a10.71,10.71,0,0,1,0,21.4Z",
    "M16.3,26.7c.67-.78,2.2-3.37,2.2-10.62S16.94,6.1,16.29,5.3a10.7,10.7,0,0,1,0,21.4Z",
    "M16.14,26.71c.37-.86,1.36-3.79,1.36-10.63s-1-9.91-1.37-10.79a10.71,10.71,0,0,1,0,21.42Z",
    "M16,26.72A85.59,85.59,0,0,0,16.5,16,85.59,85.59,0,0,0,16,5.28a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72V5.28a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72h0A85.59,85.59,0,0,1,15.5,16,85.59,85.59,0,0,1,16,5.28h0a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72h-.14c-.37-.86-1.36-3.79-1.36-10.63s1-9.91,1.37-10.79H16a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72l-.3,0c-.67-.78-2.2-3.37-2.2-10.62s1.56-10,2.21-10.78l.29,0a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72l-.45,0c-1-.78-3.05-3.34-3.05-10.7s2.1-9.92,3.05-10.7l.45,0a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72c-.28,0-.56,0-.84,0C13.85,25.94,11.5,23.57,11.5,16s2.35-9.94,3.66-10.68c.28,0,.56,0,.84,0a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72a11.7,11.7,0,0,1-1.19-.07c-1.62-.75-4.31-3.12-4.31-10.52,0-7.63,2.86-10,4.45-10.8.35,0,.7,0,1.05,0a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72a10.85,10.85,0,0,1-1.51-.12c-1.92-.81-5-3.23-5-10.5,0-7.49,3.26-9.93,5.16-10.73A11.9,11.9,0,0,1,16,5.28a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72a11.16,11.16,0,0,1-1.54-.12c-2.19-.84-6-3.34-6-10.72,0-7.12,3.5-9.59,5.72-10.44A10.43,10.43,0,0,1,16,5.28a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72a10.69,10.69,0,0,1-2.28-.25C11.35,25.55,8,23,8,16.17c0-7.3,3.78-9.84,6.15-10.72A11.26,11.26,0,0,1,16,5.28a10.72,10.72,0,0,1,0,21.44Z",
    "M16,26.72a10.63,10.63,0,0,1-3.4-.56C10.23,25,7.5,22.33,7.5,16s2.73-9,5.1-10.16A10.72,10.72,0,1,1,16,26.72Z",
    "M16,26.72a10.52,10.52,0,0,1-3.77-.7C9.77,24.81,7,22.1,7,16S9.77,7.19,12.23,6A10.52,10.52,0,0,1,16,5.28a10.72,10.72,0,0,1,0,21.44Z"
];

export const SHADOW_MAP = {
    "New Moon": MOON_SHADOWS[0],
    "New Moon Fading": MOON_SHADOWS[1],
    "New Moon Faded": MOON_SHADOWS[2],
    "Waxing Crescent Rising": MOON_SHADOWS[3],
    "Waxing Crescent Risen": MOON_SHADOWS[4],
    "Waxing Crescent": MOON_SHADOWS[6],
    "Waxing Crescent Fading": MOON_SHADOWS[7],
    "Waxing Crescent Faded": MOON_SHADOWS[8],
    "First Quarter Rising": MOON_SHADOWS[9],
    "First Quarter Risen": MOON_SHADOWS[10],
    "First Quarter": MOON_SHADOWS[12],
    "First Quarter Fading": MOON_SHADOWS[13],
    "First Quarter Faded": MOON_SHADOWS[14],
    "Waxing Gibbous Rising": MOON_SHADOWS[15],
    "Waxing Gibbous Risen": MOON_SHADOWS[16],
    "Waxing Gibbous": MOON_SHADOWS[18],
    "Waxing Gibbous Fading": MOON_SHADOWS[19],
    "Waxing Gibbous Faded": MOON_SHADOWS[20],
    "Full Moon Rising": MOON_SHADOWS[21],
    "Full Moon Risen": MOON_SHADOWS[22],
    "Full Moon": MOON_SHADOWS[24],
    "Full Moon Fading": MOON_SHADOWS[25],
    "Full Moon Faded": MOON_SHADOWS[26],
    "Waning Gibbous Rising": MOON_SHADOWS[27],
    "Waning Gibbous Risen": MOON_SHADOWS[28],
    "Waning Gibbous": MOON_SHADOWS[30],
    "Waning Gibbous Fading": MOON_SHADOWS[31],
    "Waning Gibbous Faded": MOON_SHADOWS[32],
    "Last Quarter Rising": MOON_SHADOWS[33],
    "Last Quarter Risen": MOON_SHADOWS[34],
    "Last Quarter": MOON_SHADOWS[36],
    "Last Quarter Fading": MOON_SHADOWS[37],
    "Last Quarter Faded": MOON_SHADOWS[38],
    "Waning Crescent Rising": MOON_SHADOWS[39],
    "Waning Crescent Risen": MOON_SHADOWS[40],
    "Waning Crescent": MOON_SHADOWS[42],
    "Waning Crescent Fading": MOON_SHADOWS[43],
    "Waning Crescent Faded": MOON_SHADOWS[44],
    "New Moon Rising": MOON_SHADOWS[45],
    "New Moon Risen": MOON_SHADOWS[46]
};

export const MOON_PHASES: {
    [granularity: number]: Array<Phase>;
} = {
    4: ["New Moon", "First Quarter", "Full Moon", "Last Quarter"],

    8: [
        "New Moon",
        "Waxing Crescent",
        "First Quarter",
        "Waxing Gibbous",
        "Full Moon",
        "Waning Gibbous",
        "Last Quarter",
        "Waning Crescent"
    ],

    16: [
        "New Moon",
        "New Moon Fading",
        "Waxing Crescent",
        "Waxing Crescent Fading",
        "First Quarter",
        "First Quarter Fading",
        "Waxing Gibbous",
        "Waxing Gibbous Fading",
        "Full Moon",
        "Full Moon Fading",
        "Waning Gibbous",
        "Waning Gibbous Fading",
        "Last Quarter",
        "Last Quarter Fading",
        "Waning Crescent",
        "Waning Crescent Fading"
    ],

    24: [
        "New Moon",
        "New Moon Fading",
        "Waxing Crescent Rising",
        "Waxing Crescent",
        "Waxing Crescent Fading",
        "First Quarter Rising",
        "First Quarter",
        "First Quarter Fading",
        "Waxing Gibbous Rising",
        "Waxing Gibbous",
        "Waxing Gibbous Fading",
        "Full Moon Rising",
        "Full Moon",
        "Full Moon Fading",
        "Waning Gibbous Rising",
        "Waning Gibbous",
        "Waning Gibbous Fading",
        "Last Quarter Rising",
        "Last Quarter",
        "Last Quarter Fading",
        "Waning Crescent Rising",
        "Waning Crescent",
        "Waning Crescent Fading",
        "New Moon Rising"
    ],

    40: [
        "New Moon",
        "New Moon Fading",
        "New Moon Faded",
        "Waxing Crescent Rising",
        "Waxing Crescent Risen",
        "Waxing Crescent",
        "Waxing Crescent Fading",
        "Waxing Crescent Faded",
        "First Quarter Rising",
        "First Quarter Risen",
        "First Quarter",
        "First Quarter Fading",
        "First Quarter Faded",
        "Waxing Gibbous Rising",
        "Waxing Gibbous Risen",
        "Waxing Gibbous",
        "Waxing Gibbous Fading",
        "Waxing Gibbous Faded",
        "Full Moon Rising",
        "Full Moon Risen",
        "Full Moon",
        "Full Moon Fading",
        "Full Moon Faded",
        "Waning Gibbous Rising",
        "Waning Gibbous Risen",
        "Waning Gibbous",
        "Waning Gibbous Fading",
        "Waning Gibbous Faded",
        "Last Quarter Rising",
        "Last Quarter Risen",
        "Last Quarter",
        "Last Quarter Fading",
        "Last Quarter Faded",
        "Waning Crescent Rising",
        "Waning Crescent Risen",
        "Waning Crescent",
        "Waning Crescent Fading",
        "Waning Crescent Faded",
        "New Moon Rising",
        "New Moon Risen"
    ]
};

export type Phase =
    | "New Moon"
    | "New Moon Fading"
    | "New Moon Faded"
    | "Waxing Crescent Rising"
    | "Waxing Crescent Risen"
    | "Waxing Crescent"
    | "Waxing Crescent Fading"
    | "Waxing Crescent Faded"
    | "First Quarter Rising"
    | "First Quarter Risen"
    | "First Quarter"
    | "First Quarter Fading"
    | "First Quarter Faded"
    | "Waxing Gibbous Rising"
    | "Waxing Gibbous Risen"
    | "Waxing Gibbous"
    | "Waxing Gibbous Fading"
    | "Waxing Gibbous Faded"
    | "Full Moon Rising"
    | "Full Moon Risen"
    | "Full Moon"
    | "Full Moon Fading"
    | "Full Moon Faded"
    | "Waning Gibbous Rising"
    | "Waning Gibbous Risen"
    | "Waning Gibbous"
    | "Waning Gibbous Fading"
    | "Waning Gibbous Faded"
    | "Last Quarter Rising"
    | "Last Quarter Risen"
    | "Last Quarter"
    | "Last Quarter Fading"
    | "Last Quarter Faded"
    | "Waning Crescent Rising"
    | "Waning Crescent Risen"
    | "Waning Crescent"
    | "Waning Crescent Fading"
    | "Waning Crescent Faded"
    | "New Moon Rising"
    | "New Moon Risen";
