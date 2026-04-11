# Yoly Estética — Website

Static website for Yoly Estética beauty salon.  
**Stack:** Pure HTML + CSS + JS — no build tools required.

---

## Local preview

Just open `index.html` in your browser, or use VS Code's Live Server extension.

---

## Secrets management

API keys and booking URLs are **never stored in the repo**. They live in GitHub repository secrets and are injected at deploy time by GitHub Actions.

**To add/update a secret:**
1. Go to your repo on GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these two secrets:

| Secret name | Value |
|---|---|
| `WEB3FORMS_KEY` | Your Web3Forms access key (from web3forms.com) |
| `GOLDIE_BOOKING_URL` | Your Goldie booking URL (from Goldie app → Menu → Online Booking → Share) |

The deploy workflow (`.github/workflows/deploy.yml`) automatically replaces `__WEB3FORMS_KEY__` and `__GOLDIE_BOOKING_URL__` placeholders in `index.html` before publishing.

---

## Deployment (GitHub Pages — Free)

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`). Every push to `main` triggers a deploy.

**One-time setup:**
1. Add your secrets (see above).
2. Go to your repo on GitHub → **Settings** → **Pages**.
3. Under **Source**, select **GitHub Actions**.
4. Click **Save**.
5. Push any change to `main` — the action will build and deploy automatically.
6. Your site will be live at `https://rjma341.github.io/yolyestetica-website/`

### Custom domain (optional)
If you have a domain (e.g. `yolyestetica.com`):
1. In GitHub Pages settings, enter your domain under **Custom domain**.
2. At your domain registrar, add a CNAME record:  
   `www` → `rjma341.github.io`
3. GitHub will auto-provision an SSL certificate.

---

## Contact form setup (Web3Forms — Free, 250/month)

The contact form uses [Web3Forms](https://web3forms.com):

1. Go to https://web3forms.com and click **"Get your Access Key"**.
2. Enter your email — they'll send your key instantly (no credit card needed).
3. Open `index.html` and find this line:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY" />
   ```
4. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your actual key.
5. Done — submissions go straight to your email, with spam filtering included.

---

## Customization checklist

- [ ] Replace placeholder text (address, phone, hours, email) in `index.html`
- [ ] Add real photos to the `images/` folder (see `images/README.md`)
- [ ] Update Instagram / Facebook / WhatsApp links (search for `yolyestetica` and your phone number)
- [ ] Update the Google Maps embed URL with the real salon location
- [ ] Update services and prices
- [ ] Set up Web3Forms and replace `YOUR_WEB3FORMS_ACCESS_KEY` in `index.html`
- [ ] Enable GitHub Pages in repo settings

---

## Google Maps embed

1. Go to [Google Maps](https://maps.google.com) and search your salon's address.
2. Click **Share** → **Embed a map** → Copy the `<iframe>` src URL.
3. Replace the `src` in the `.map-section` iframe in `index.html`.
