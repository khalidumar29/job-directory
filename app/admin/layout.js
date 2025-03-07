import { Toaster } from "react-hot-toast";
import Navbar from "./components/Nabar";

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        {children}
        <Toaster position='top-right' />
      </body>
    </html>
  );
}
