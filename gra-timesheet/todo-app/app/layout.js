import './globals.css';

export const metadata = {
  title: 'My To-Do App',
  description: 'MKS Ventures - First Build',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
