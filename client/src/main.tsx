import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
function setVh() {
  const vh = window.visualViewport ? window.visualViewport.height * 0.01 : window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// ensure listeners/register only once (avoids duplicates during HMR/dev)
if (!(window as any).__vh_setup) {
  setVh();
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", setVh);
    window.visualViewport.addEventListener("scroll", setVh);
  } else {
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
  }
  ;(window as any).__vh_setup = true;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        theme: dark,
        variables: {
          colorBackground: "#0f0f0f"
        }
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
