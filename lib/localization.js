import data from '@/data/localization_data';

export default function t(id='', loc='fi') {
    const str = data?.[loc]?.[id];
    if (str) return str;
    return id;
}