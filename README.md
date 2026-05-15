# Detail Dogs Redirect

This repo is configured for Vercel to redirect traffic from `https://www.detaildogs.com` to `https://detaildogs.vercel.app`.

## Deploy

1. Push this folder to a GitHub repository.
2. Import that repository into Vercel.
3. Add `www.detaildogs.com` as a domain on the Vercel project.
4. Point the DNS record for `www.detaildogs.com` to Vercel.

The redirect rules live in `vercel.json` and preserve paths, so `https://www.detaildogs.com/services` redirects to `https://detaildogs.vercel.app/services`.
