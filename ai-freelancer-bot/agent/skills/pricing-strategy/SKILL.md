---
description: Bepaal het juiste freelance tarief, onderhandel over prijs, en bereken fixed-price offertes.
---

# Pricing Strategy

## Wanneer activeren

- Gebruiker vraagt "wat moet ik vragen?"
- Gebruiker twijfelt over een budget in een opdracht
- Gebruiker wil van uurtarief naar fixed price

## Stappen

1. Roep `calculate_rate` aan met relevante parameters
2. Vergelijk met het huidige profiel (`manage_profile`)
3. Geef advies in drie tiers:

| Tier | Wanneer |
|------|---------|
| **Minimum** | Nieuwe klant, portfolio opbouwen, lage complexiteit |
| **Aanbevolen** | Standaard — gebruik dit als default |
| **Premium** | Urgent, specialistisch, of klant met groot budget |

## Fixed-price formule

```
Fixed price = (uren × uurtarief) × 1.15 buffer + scope-onduidelijkheid
```

- Voeg 15-25% buffer toe bij onduidelijke scope
- Splits grote projecten in milestones (30/40/30% betaling)

## Onderhandeling

- Nooit direct akkoord met eerste bod als het >20% onder markt ligt
- Bied alternatief: minder scope voor het budget, of hoger tarief met snellere delivery
- Weiger respectvol als budget <50% van minimum tarief

## Output

Geef altijd concrete bedragen in EUR (of USD bij US-markt), geen vage ranges zonder uitleg.
