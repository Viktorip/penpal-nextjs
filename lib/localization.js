import { LocalizationContext } from '@/app/layout';
import data from '@/data/localization_data';
import { useContext } from 'react';

export default function t(id='') {
    const {loc, undefined} = useContext(LocalizationContext);
    const str = data?.[loc]?.[id];
    if (str) return str;
    return id;
}