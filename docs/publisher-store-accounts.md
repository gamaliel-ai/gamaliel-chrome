# Store publisher accounts (Chrome + iOS)

Canonical place for **storefront identity** (organization publisher, not a personal hobby account). Procedure after the account exists: Chrome [chrome-web-store.md](chrome-web-store.md); iOS [`../../gamaliel-ios-macos/docs/testflight-setup.md`](../../gamaliel-ios-macos/docs/testflight-setup.md).

Gamaliel is a ministry of a **nonprofit** (Beloved in Christ Foundation). Store marketplaces still treat an **organization publishing an official app** as a professional publisher — not a personal hobby account. This is the same class of issue on **Chrome Web Store** and the **Apple App Store**.

## Remaining work

Organization publisher accounts are not finished. Still needed:

- Chrome Web Store: org Google account registered as a developer, **trader** status declared and verified as the Foundation, people who upload invited with the right roles.
- Apple: **organization** Apple Developer enrollment for the same legal entity (not an individual team). Confirm the Team ID in the iOS TestFlight doc is the org team before a public App Store submit.
- Do **not** finish first submit under a personal Google or Apple ID and plan to “transfer later.”

Engineering can zip/build; do **not** self-declare trader status or enroll Apple Developer as an individual to unblock a ship.

## Chrome Web Store (sticking point for [G-0005](backlog/G-0005-chrome-web-store-and-site-cta.md))

Dashboard: [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

When Google asks **trader vs non-trader** ([policy](https://developer.chrome.com/docs/webstore/program-policies/trader-disclosure)):

| Choice | Meaning |
| ------ | ------- |
| **Trader** | Legal person acting for purposes related to its trade, business, craft, or **profession** on this marketplace. **Use this** for the Foundation publishing Gamaliel. Nonprofit ≠ hobbyist. |
| **Non-trader** | Acting *outside* that professional purpose (personal project). Wrong for an org listing. EEA users are told EU consumer-protection rights do not apply. |

Trader verification collects legal name, contact details, and documents; some of that can appear on the listing. That is expected for an org publisher.

After the Chrome items above are done, continue [chrome-web-store.md](chrome-web-store.md) from zip upload.

## Apple App Store / TestFlight (same identity)

Same remaining work as above: enroll **Apple Developer as the organization** (same legal entity), not an individual team that later has to migrate.

Technical TestFlight/upload steps once the team exists: [`../../gamaliel-ios-macos/docs/testflight-setup.md`](../../gamaliel-ios-macos/docs/testflight-setup.md).

## Do not

- Submit the Chrome item as **non-trader** because the Foundation is not for-profit.
- Mix personal and org listings for the same product.
- Duplicate this guidance in tickets — link here.
