"use client";

import dynamic from 'next/dynamic';

const VideoCrunchClient = dynamic(() => import('./VideoCrunchClient'), {
    ssr: false,
});

export default function VideoCrunchPage() {
    return <VideoCrunchClient />;
}
