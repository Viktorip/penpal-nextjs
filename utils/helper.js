import { gluten, grechen, shantell, serious, dancing, grapenuts, squarepeg } from "@/app/fonts";
import { FONT_DANCING, FONT_GLUTEN, FONT_GRAPENUTS, FONT_GRECHEN, FONT_SERIOUS, FONT_SHANTELL, FONT_SQUAREPEG } from "./constants";

const fontmap = [
    {
        id: FONT_GRAPENUTS,
        className: grapenuts.className
    },
    {
        id: FONT_GLUTEN,
        className: gluten.className
    },
    {
        id: FONT_GRECHEN,
        className: grechen.className
    },
    {
        id: FONT_SHANTELL,
        className: shantell.className
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
    return style?.className || fontmap[0].className;
}

export const getAllStamps = ()=>{
    return ['stamps/empty_stamp.png', 'stamps/punatulkku_stamp.png', 'stamps/suomi180_stamp.png'];
}