"use client";
export default function AdminOrders (){
    return(
        <main className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-[var(--color-accent-blue)] px-4" style={{padding: '4rem 1rem'}}>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4" style={{fontSize: '2.25rem', fontWeight: 700, textAlign: 'center'}}>Admin Orders</h1>
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl text-center mb-6" style={{fontSize: '1rem', lineHeight: 1.5}}>
              Manage and review all customer orders here. Use the admin panel to update order statuses and view order details.
            </p>
        </main>
    )
}
