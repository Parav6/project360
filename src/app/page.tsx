"use client";


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-[var(--color-bg-default)] px-4" style={{padding: '4rem 1rem'}}>
      <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-6" style={{fontSize: '2.25rem', fontWeight: 700, textAlign: 'center'}}>Welcome to Project360</h1>
      <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl text-center mb-8" style={{fontSize: '1rem', lineHeight: 1.5}}>
        Discover unique products, enjoy a playful shopping experience, and explore our hand-drawn illustrations and pastel palette. Shop now and experience a fresh, modern e-commerce journey!
      </p>
      <button className="bg-[var(--color-accent-pink)] text-[var(--color-text-primary)] px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-[var(--color-accent-yellow)] transition-all" style={{fontWeight: 700, borderRadius: '9999px'}}>Shop Now</button>
    </main>
  );
}

