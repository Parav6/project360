"use client";
export default function About (){
    return(
        <main className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-[var(--color-accent-yellow)] px-4" style={{padding: '4rem 1rem'}}>
            <div className="flex flex-col items-center justify-center rounded-full bg-[var(--color-bg-default)] px-8 py-12 shadow-lg" style={{borderRadius: '999px', background: 'var(--color-bg-default)', boxShadow: 'var(--shadow-default)'}}>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4" style={{fontSize: '2.25rem', fontWeight: 700, textAlign: 'center'}}>About Us</h1>
                <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl text-center mb-6" style={{fontSize: '1rem', lineHeight: 1.5}}>
                  We blend playful, hand-drawn illustrations with a modern, pastel palette to create a unique e-commerce experience. Our mission is to make shopping delightful, friendly, and visually inspiring.
                </p>
                <button className="bg-[var(--color-accent-pink)] text-[var(--color-text-primary)] px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-[var(--color-accent-yellow)] transition-all" style={{fontWeight: 700, borderRadius: '9999px'}}>Learn More</button>
            </div>
        </main>
    )
}

