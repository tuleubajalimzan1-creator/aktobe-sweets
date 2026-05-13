import Header from './Header'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
