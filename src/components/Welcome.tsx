"use client"
import React, { useRef } from 'react'

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

    return (
        <section id="welcome">
            <p ref={subtitleRef}>{renderText("Portfolio", "text-3xl font-georama", 100)}</p>
            <h1 className='mt-7' ref={titleRef}>{renderText("I am Ravi Gangwar", "sm:text-4xl md:text-6xl text-9xl italic font-georama", 100)}</h1>
        </section>
    )
}

export default Welcome