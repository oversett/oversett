---
product: material-ui
title: React Card component
components: Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Collapse, Paper
githubLabel: "component: card"
materialDesign: https://material.io/components/cards
---

# Card

<p class="description">Cards contain content and actions about a single subject.</p>

Cards are surfaces that display content and actions on a single topic.

{{"component": "modules/components/ComponentLinkHeader.js"}}

## Basic card

Although cards can support multiple actions, UI controls, and an overflow menu, use restraint.

{{"demo": "BasicCard.js", "bg": true}}

### Outlined Card

Set `variant="outlined"` to render an outlined card.

{{"demo": "OutlinedCard.js", "bg": true}}

## Media

Example of a card using an image to reinforce the content.

:::warning
⚠️ When `component="img"`, CardMedia relies on `object-fit` for centering the image.
:::

## UI Controls

🎨 If you are looking for inspiration, you can check [MUI Treasury's customization examples](https://mui-treasury.com/components/card/).
