import "../styles/globals.css"

export const metadata = {
  title: "Agar Exam B2 JG",
  description: "Agar Exam B2 JG",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  )
}
