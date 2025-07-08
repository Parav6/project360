"use client";



export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-8 bg-[var(--color-bg-muted)]" style={{background: 'var(--color-bg-muted)', borderTop: '1px solid var(--color-border)'}}>
      <div className="max-w-[1280px] w-full flex flex-col items-center">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg font-bold text-[var(--color-text-primary)]">Project360</span>
          <span className="text-sm text-[var(--color-text-secondary)]">&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="text-sm text-[var(--color-text-muted)] italic" style={{fontFamily: 'cursive'}}>Hand-drawn illustrations & playful e-commerce</div>
      </div>
    </footer>
  );
}
