export interface Moon {
    name: string;
    cycle: number;
    offset: number;
    faceColor: string;
    shadowColor: string;
    id: string;
}
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
