import { Toaster } from "react-hot-toast";
import Navbar from "./components/Nabar";
import Providers from "./components/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        <Providers>{children}</Providers>;
        <Toaster position='top-right' />
      </body>
    </html>
  );
}
