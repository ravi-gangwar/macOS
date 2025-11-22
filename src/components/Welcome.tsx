"use client"
import React, { useRef } from 'react'
import { useTextSize } from '../hooks/useTextSize'

const renderText = (text: string, className: string, baseWeight: number) => {
    return [...text].map((char, index) => (
        <span
            key={index}
            className={className}
            style={{fontVariationSettings: `whgt ${baseWeight}`}}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ))
}

function Welcome() {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const { getTextSize } = useTextSize();

    return (
        <section id="welcome">
            {/* <p ref={subtitleRef} className={getTextSize('3xl')}>{renderText("Portfolio", "font-georama", 100)}</p>
            <h1 className={`mt-7 ${getTextSize('4xl')} italic font-georama`} ref={titleRef}>{renderText("I am Ravi Gangwar", "", 100)}</h1> */}
        </section>
    )
}

export default Welcome