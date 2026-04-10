# Yoly Estética — Website

Static website for Yoly Estética beauty salon.  
**Stack:** Pure HTML + CSS + JS — no build tools required.

---

## Local preview

Just open `index.html` in your browser, or use VS Code's Live Server extension.

---

## Deployment (GitHub Pages — Free)

1. Push all files to the `main` branch of your GitHub repo.
2. Go to your repo on GitHub → **Settings** → **Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Choose branch: `main`, folder: `/ (root)`.
5. Click **Save**.
6. Your site will be live at `https://rjma341.github.io/yolyestetica-website/` within a minute.

### Custom domain (optional)
If you have a domain (e.g. `yolyestetica.com`):
1. In GitHub Pages settings, enter your domain under **Custom domain**.
2. At your domain registrar, add a CNAME record:  
   `www` → `rjma341.github.io`
3. GitHub will auto-provision an SSL certificate.

---

## Contact form setup (Formspree — Free tier available)

The contact form is wired for [Formspree](https://formspree.io):

1. Sign up at https://formspree.io (free for up to 50 submissions/month).
2. Create a new form — copy your **Form ID** (looks like `xpwzqabc`).
3. Open `script.js` and replace `'YOUR_FORM_ID'` with your actual ID:
   ```js
   const formspreeId = 'xpwzqabc';
   ```
4. Done — form submissions will go to your email.

---

## Customization checklist

- [ ] Replace placeholder text (address, phone, hours, email) in `index.html`
- [ ] Add real photos to the `images/` folder (see `images/README.md`)
- [ ] Update Instagram / Facebook / WhatsApp links (search for `yolyestetica` and your phone number)
- [ ] Update the Google Maps embed URL with the real salon location
- [ ] Update services and prices
- [ ] Set up Formspree and replace `YOUR_FORM_ID`
- [ ] Enable GitHub Pages in repo settings

---

## Google Maps embed

1. Go to [Google Maps](https://maps.google.com) and search your salon's address.
2. Click **Share** → **Embed a map** → Copy the `<iframe>` src URL.
3. Replace the `src` in the `.map-section` iframe in `index.html`.
