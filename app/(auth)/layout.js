import '../globals.css'

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="h-full bg-black flex justify-center items-center">{children}</body>
        </html>
    )
}
