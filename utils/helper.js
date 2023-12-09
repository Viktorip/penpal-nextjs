import { caveat, indieflower, nothing, parisienne, reeniebeanie, tangerine } from "@/app/fonts";
import { FONT_CAVEAT, FONT_INDIEFLOWER, FONT_NOTHING, FONT_PARISIENNE, FONT_REENIEBEANIE, FONT_TANGERINE } from "./constants";

const fontmap = [
    {
        id: FONT_CAVEAT,
        className: caveat.className
    },
    {
        id: FONT_INDIEFLOWER,
        className: indieflower.className
    },
    {
        id: FONT_NOTHING,
        className: nothing.className
    },
    {
        id: FONT_PARISIENNE,
        className: parisienne.className
    },
    {
        id: FONT_REENIEBEANIE,
        className: reeniebeanie.className
    },
    {
        id: FONT_TANGERINE,
        className: tangerine.className
    },
];

export const getAllStyleIds = () => {
    const ids = fontmap.flatMap(item => item.id);
    return ids;
}

export const getClassNameFromStyleId = (id) => {
    const style = fontmap.find(item => (item.id === id));
    return style.className;
}

export const getAllStamps = ()=>{
    return ['stamps/empty_stamp.png', 'stamps/punatulkku_stamp.png', 'stamps/suomi180_stamp.png'];
}