# 🚀 SATOHASH REBUILD: The "Luminous" Edition (V2)

**Role**: You are an elite Senior Frontend Architect and World-Class Product Designer. You specialize in building "Trustware"—web applications that feel as secure and premium as a Swiss bank vault, but as simple as Apple Notes.

**Goal**: Build a complete, production-ready React application for **Satohash**. This is not a drill. This is a V2 rebuild focusing on **Lightness**, **Speed**, and **Visual Perfection**.

---

## 🎨 Design Language: "Digital Clarity" (Light Mode First)
*   **Aesthetics**: Glassmorphism on White. Soft, colored shadows. No harsh borders.
    *   *Background*: `#F8FAFC` (Slate 50) with subtle animated gradients in the corners.
    *   *Glass*: `backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.7);`
    *   *Accent*: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)` (Indigo-Violet).
*   **Typography**: `Inter` (UI) for readability, `Space Grotesk` (Headers) for tech feel.
*   **Micro-interactions**: buttons *must* scale down on click (`scale-95`). Links *must* have underline animations. Cards *must* hover-lift.

---

## 🧩 Core Features & Architecture

### 1. The Global Dropzone (The "God Mode" Drag)
*   **Concept**: The user can drag a file *anywhere* on the screen.
*   **Interaction**:
    1.  User drags file into window -> Entire screen dims (`bg-slate-900/10`).
    2.  A glowing dashed border pulsaties around the window edges.
    3.  Text appears: "Drop to Secure Logic".
    4.  **Reference Code**:
        ```jsx
        // Use a high-level context or layout wrapper
        <div onDragEnter={() => setIsDragging(true)} ...>
          {isDragging && <motion.div initial={{opacity:0}} animate={{opacity:1}} ... />}
        </div>
        ```

### 2. The Hashing "Ceremony"
*   **Visual**: Do not just show a spinner. Show the browser calculating the SHA-256 hash.
*   **Data**: Display the file size, type, and live hash progress (fake it if needed for speed, but make it look real).
*   **Crypto**: Use `window.crypto.subtle.digest('SHA-256', arrayBuffer)`.

### 3. OpenTimestamps (OTS) Integration
*   **Primary Action**: User drops file -> App hashes it -> App requests OTS timestamp.
*   **Output**:
    *   **OTS File**: Downloadable `.ots` proof.
    *   **PDF Certificate**: A professionally designed PDF with the hash, time, and QR code.
    *   **Email Token**: "Email this proof to me" (Simulate email service with a toast notification).

### 4. Premium "Empty State" (The "Anticipation")
*   **Before Upload**: The dashboard is NOT empty. It shows "Ghost Cards" or "Skeleton Loaders" of potential contracts.
*   **Text**: "Waiting for your first digital witness..."
*   **Action**: A large, beautiful "Upload Document" button that breathes (scales up/down slowly).

---

## 📄 Site Structure & Pages

### 1. Landing Page (The "Hook")
*   **Hero Section**: Large Typography. "Immutable Proof. Zero Trust Required."
    *   *Animation*: Text gradient shifts.
*   **Education Cards**: 3 Cards explaining the tech (Hash, Anchor, Verify).
    *   *Video*: `[INSERT YOUTUBE: How Hashing Works]`
*   **Global Footer**: Links to all pages, Social Icons (Twitter, GitHub, Discord).

### 2. The App (Dashboard)
*   **Contract List**: "Recent Notarizations" (Persist in LocalStorage).
*   **Templates Section**:
    *   "Self-Sovereign Identity"
    *   "Copyright Claim"
    *   "Last Will (Digital)"
*   **Donations Section**:
    *   "Support the Protocol".
    *   BTC Address (QR Code).
    *   Lightning Invoice (QR Code).
    *   "Tip in Fiat" (Stripe Link).

### 3. Verify Page
*   **Two Dropzones**: 1. Original File, 2. OTS File.
*   **Logic**: Verify that `Hash(File) + OTS == Success`.
*   **Result**: Massive GREEN success screen with confetti.

### 4. About Us
*   **Story**: "Satohash was born from the need for truth in a post-truth world."
*   **Team**: Anonymous/Pseudonymous profiles (e.g., "The Architect").

### 5. Legal & TOS (Full Sections)
*   **Terms of Service**:
    > "Verification of timestamping is provided on an 'as is' basis without warranty of any kind. Satohash connects your data to the OpenTimestamps calendar but does not store your files. You are solely responsible for retaining your original files and OTS proofs."
*   **Privacy Policy**:
    > "We are a client-side only application. Your files never leave your browser. Hashing happens locally on your device using WebCrypto API."

---

## 📝 Technical Implementation Steps (For the AI)
1.  **Setup**: `npm create vite@latest satohash -- --template react`
2.  **Install**: `npm install framer-motion lucide-react clsx tailwind-merge canvas-confetti jspdf`
3.  **Config**: Set up Tailwind with the *Satohash Light* color palette.
4.  **Components**: Build `GlobalDropzone`, `VerificationCard`, `Footer`, `Navbar`.
5.  **Logic**: Implement the logic to create a dummy `.ots` file (or fetch from a public OTS server if possible, otherwise mock the structure for V2 demo).

**Final Deliverable**: A fully functioning, distinctively "Light & Premium" React application associated with the domain `satohash.com`.
