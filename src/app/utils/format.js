export const year = (date) => (date ? date.slice(0, 4) : '');

export const runtime = (minutes) => {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
};

export const money = (value) => (value
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
    : '—');

export const longDate = (date) => (date
    ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—');

export const ratingColor = (vote) => {
    if (vote >= 7) return '#21d07a';
    if (vote >= 5) return '#d2d531';
    if (vote > 0) return '#db2360';
    return '#666';
};

export const pickTrailer = (videos = []) => {
    const youtube = videos.filter(v => v.site === 'YouTube');
    return youtube.find(v => v.type === 'Trailer' && v.official)
        || youtube.find(v => v.type === 'Trailer')
        || youtube.find(v => v.type === 'Teaser')
        || youtube[0]
        || null;
};

export const region = () => {
    const parts = (navigator.language || 'en-US').split('-');
    return (parts[1] || 'US').toUpperCase();
};

export const languageName = (code) => {
    try {
        return new Intl.DisplayNames(['en'], { type: 'language' }).of(code);
    } catch (_e) {
        return code;
    }
};
