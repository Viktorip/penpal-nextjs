import { caveat, indieflower, serious, dancing, grapenuts, squarepeg } from "@/app/fonts";
import { FONT_CAVEAT, FONT_DANCING, FONT_GRAPENUTS, FONT_INDIEFLOWER, FONT_SERIOUS, FONT_SQUAREPEG } from "./constants";

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
        id: FONT_SERIOUS,
        className: serious.className
    },
    {
        id: FONT_DANCING,
        className: dancing.className
    },
    {
        id: FONT_GRAPENUTS,
        className: grapenuts.className
    },
    {
        id: FONT_SQUAREPEG,
        className: squarepeg.className
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