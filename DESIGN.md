---
name: "張老師音樂學院"
description: "A quietly typeset music book in window light."
colors:
  accent: "#70604c"
  accent-hover: "#443a2d"
  ink: "#30342f"
  muted: "#686b62"
  paper: "#f7f6f2"
  white: "#fffefa"
  line: "#d9d9d0"
  tint: "#eeede6"
  field-border: "#9b9f91"
  placeholder: "#6c7065"
typography:
  display: {fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif', fontSize: "29px", fontWeight: 400, lineHeight: 2.15, letterSpacing: ".1em"}
  display-mobile: {fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif', fontSize: "23px", fontWeight: 400, lineHeight: 1.9, letterSpacing: ".1em"}
  headline: {fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif', fontSize: "34px", fontWeight: 400, lineHeight: 1.8, letterSpacing: ".07em"}
  section: {fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif', fontSize: "27px", fontWeight: 400, lineHeight: 1.8, letterSpacing: ".06em"}
  title: {fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif', fontSize: "22px", fontWeight: 400, lineHeight: 1.8, letterSpacing: ".035em"}
  title-journal: {fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif', fontSize: "23px", fontWeight: 400, lineHeight: 1.8, letterSpacing: ".025em"}
  body: {fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif', fontSize: "17px", fontWeight: 400, lineHeight: 2.05}
  reading: {fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif', fontSize: "18px", fontWeight: 400, lineHeight: 2.2}
  label: {fontFamily: '"Manrope", system-ui, -apple-system, "Microsoft JhengHei", sans-serif', fontSize: "13px", fontWeight: 400, lineHeight: 1.8}
  navigation: {fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif', fontSize: "14px", fontWeight: 400, lineHeight: 2.05, letterSpacing: ".06em"}
  button: {fontFamily: '"Noto Serif TC", "Songti TC", "PMingLiU", serif', fontSize: "16px", fontWeight: 400, lineHeight: 1.5}
rounded:
  square: "0"
spacing:
  small: "12px"
  medium: "24px"
  large: "32px"
  section: "88px"
  section-tablet: "68px"
  section-mobile: "54px"
  gutter: "clamp(24px, 5vw, 76px)"
components:
  button-primary: {backgroundColor: "{colors.ink}", textColor: "{colors.white}", typography: "{typography.button}", rounded: "{rounded.square}", padding: "12px 25px"}
  button-primary-hover: {backgroundColor: "{colors.accent-hover}", textColor: "{colors.white}"}
  button-secondary: {backgroundColor: "transparent", textColor: "{colors.ink}", typography: "{typography.button}", rounded: "{rounded.square}", padding: "12px 25px"}
  button-secondary-hover: {backgroundColor: "{colors.tint}", textColor: "{colors.ink}"}
  hero-action: {backgroundColor: "transparent", textColor: "{colors.ink}", typography: "{typography.button}", rounded: "{rounded.square}", padding: "10px 0"}
  text-field: {backgroundColor: "{colors.white}", textColor: "{colors.ink}", rounded: "{rounded.square}", padding: "12px 14px"}
  navigation: {textColor: "{colors.ink}", typography: "{typography.navigation}", padding: "10px 0"}
  filter-chip: {backgroundColor: "transparent", textColor: "{colors.muted}", rounded: "{rounded.square}", padding: "9px 2px"}
  filter-chip-selected: {backgroundColor: "transparent", textColor: "{colors.ink}"}
  journal-card: {textColor: "{colors.ink}", typography: "{typography.title-journal}"}
  contents-navigation: {textColor: "{colors.ink}", padding: "22px 0 10px"}
  vertical-heading: {textColor: "{colors.ink}", typography: "{typography.display}", height: "294px"}
---

# Design System: 張老師音樂學院

## Overview

**Creative North Star: "A Music Book in Window Light"**

A classical, literary music book with Japanese minimalist restraint. The approved AMAHARE and SABOE references inform the measured whitespace, quiet Song typography and attention given to each original image.

The system is extracted from assets/css/editorial.css and assets/fonts/fonts.css. Music and teaching remain the subject: original logo, teacher portrait, illustrations, instructional diagrams and authored Traditional Chinese content retain their identity.

**Key Characteristics:**

- Paper, ink and restrained tea brown establish a calm reading atmosphere.
- Regular Song type carries headings, navigation and Chinese reading; small sans labels support it.
- Unrounded imagery, fine rules and open compositions keep the interface quiet.

## Colors

### Primary
Tea Brown is the link and focus accent; Deep Tea is its hover shade. Primary buttons use Ink, while selected category labels remain transparent with an ink underline.

### Neutral
Ink carries headings and body copy; Muted Ink supports descriptions and captions. Paper is the page and header canvas. Warm White holds fields and the homepage image bookplate; Soft Tint groups practical controls and the footer. Fine Rule divides sections; Field Border and Placeholder support native inputs.

**The Quiet Ink Rule.** Let paper and ink dominate; keep the original colors within the preserved images and diagrams.

## Typography

Noto Serif TC at regular weight (400) provides the Song voice for Chinese headings, prose and controls. It is self-hosted in 108 WOFF2 book subsets with font-display: swap, followed by Songti TC and PMingLiU. Manrope supports small Latin identity lines, metadata, counts and numerals; it is not the Chinese reading face.

The frontmatter records the main desktop hierarchy. The homepage heading uses vertical-rl with mixed text orientation and two separate lines. Tablet type is 27px/2.1; mobile retains vertical writing at the recorded mobile size. Page titles are 31px on tablet and 27px on mobile. Lower section headings stay measured, generally 24–30px.

Article titles use 34px/1.85 with .04em tracking; mobile uses 28px/1.85 with .035em tracking. Article prose remains 18px, with line-height 2.15 on mobile. General mobile prose is 16px/2. Headings allow overflow wrapping and balanced text; the vertical homepage title is deliberately unwrapped.

**The Regular Song Rule.** Preserve regular-weight Song typography and generous leading across Chinese headings and reading.

## Layout

The centered main measure is 1160px with the fluid gutters recorded above. Article heading and shell use a 1040px outer measure; desktop reading pairs a 176px contents rail with a maximum 700px body and 72px gap. Standard bands use the recorded vertical spacing and a fine rule between adjacent bands.

The sticky masthead has a 96px minimum height. At 1150px, navigation compresses and the article rail becomes 160px with a 48px gap. At 920px, gutters become 32px, the header 80px, the menu collapses and article contents move above the body. At 680px, gutters become 24px and the header 78px; multi-column sections stack.

The homepage places a framed image beside the vertical heading, short horizontal description and line actions. Desktop columns use 1.42fr/.88fr; the bookplate has 26px padding and a 435px image. At 680px, the image and 100px heading column remain side by side, with a 20px gap, 10px bookplate padding and a 234px image; description and actions span both columns below.

Course imagery uses two columns, with even homepage entries offset by 90px; mobile removes the offset and stacks entries. Journal cards progress from three to two to one column. The teacher portrait remains 4:5, with an 88% width on mobile. Print returns content to a continuous white reading page and preserves practice tables.

## Elevation & Depth

All surfaces are flat, with no box shadows. Whitespace, fine rules, image framing and occasional Soft Tint areas distinguish groups. Search focus darkens its bottom rule; keyboard focus uses an outline.

**The Flat Page Rule.** Build hierarchy with spacing and rules; keep controls and content free of decorative elevation.

## Shapes

Corners are square throughout buttons, fields, pagination and imagery. Rules are generally 1px. Gallery and journal images use 3:2; the homepage illustration has its own bookplate crop. Category filters are unboxed text controls with a bottom rule in the selected state.

## Components

**Actions:** Primary buttons use Ink and Warm White; secondary buttons are transparent with a muted stroke. Both have a 48px minimum height and use 12px 20px padding on mobile. Homepage actions are the specific line-link treatment: no fill, a bottom rule and a 44px minimum height.

**Fields and selections:** Native inputs retain labels, square borders and Warm White surfaces. Checkboxes and radios are 20px with an ink accent. Search is an open bottom-rule field with 20px text, reduced to 17px on mobile. Selected preference rows use Soft Tint and a stronger border. Category filters preserve aria-pressed; pagination preserves aria-current and 44px minimum width.

**Navigation:** The original logo, regular Song name and small Latin identity sit in the sticky masthead. Current and hovered links use Tea Brown with a text underline. The enquiry link is separated by a vertical rule on desktop and a horizontal rule in the collapsed menu. Preserve labelled menu controls and the visible-on-focus skip link.

**Editorial compositions:** Journal text sits openly beneath original imagery. Ruled learning pathways use text rows. The home bookplate leaves an unprinted margin around its image; the adjacent vertical title remains present on desktop and mobile. Articles retain their prose, artwork, diagrams, sources and onward links in a continuous reading column.

**Reading contents:** A quiet desktop rail sticks at top 124px, with a fine upper rule and regular Song links. At 920px it becomes a static wrapping row above the article, bounded by fine rules.

**Focus and motion:** Focus-visible uses a 2px Tea Brown outline with 5px offset; search uses 1px offset. Motion follows a fine ink rule: navigation, category and search indicators extend in 200ms with cubic-bezier(.16,1,.3,1), with 140ms control feedback. The mobile menu settles by 4px over 180ms and its three strokes become a close symbol. FAQ disclosures keep native immediate content opening; only the plus-to-minus indicator transitions. All effects are CSS-only and enabled solely inside prefers-reduced-motion: no-preference. Reduced motion keeps every selected, focus and disclosure state without animation. Content and imagery are fully visible immediately; there are no entrance reveals, scroll listeners, looping motion or added animation dependencies.

**Practical tools:** Native FAQ disclosures, advice fields, preference choices, practice checklists and enquiry preparation retain their existing controls and feedback. Soft Tint marks their grouped areas without changing their behavior.

## Do's and Don'ts

### Do:

- **Do** preserve original imagery, alt text, authored copy and working controls.
- **Do** keep the homepage title vertical on desktop and mobile, with horizontal supporting copy.
- **Do** preserve regular Song reading, visible focus, semantic selected states and reduced-motion behavior.

### Don't:

- **Don't** enlarge quiet headings into promotional poster typography.
- **Don't** add rounded cards, pill filters, decorative shadows or repeated entrance effects.
- **Don't** replace preserved assets or infer visual tokens from reference images instead of the implementation.
