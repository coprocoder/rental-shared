# @rental/ui — the UI kit

Shipped as **source**: the consumer's Vite compiles the `.vue` files. Components in 5
folders by purpose, imported explicitly by path:
`import Card from '@rental/ui/layout/Card.vue'`. Tokens: `import '@rental/ui/tokens.css'`.
Composables from the root: `import { useToast, useAppearance } from '@rental/ui'`.
Live showcase: `/dev/kit` in the frontend.

⚠️ **The kit knows no application.** No API, no router, no app state: its own state is
`src/state.ts` (`resetUiState()` for tests). The API error card (`ErrorCard`, with the
plan-required branch and a link to `/admin/plan`) therefore lives in the frontend,
`app/core/api/ErrorCard.vue` — it reads the API envelope, which is not a kit concern.

```
form/      Button, Field, DateField, TimeField, PhoneField, Select,
           Checkbox, RadioGroup, Segmented, Stepper, DateRange,
           AppearanceToggle
feedback/  Message, Empty, Toast, Spinner, Skeleton
layout/    Stack, Grid, Container, Card, Disclosure
data/      Table, Text, Price, Badge, KeyValue
overlay/   Modal
```

⚠️ `Spinner`, `Skeleton` и `Toast` лежат рядом не случайно: все три —
про ожидание и его исход. Скелетон для первой загрузки блока, спиннер
для действия внутри кнопки, тост для «готово». Выбор между ними — это
выбор ЧТО СЕЙЧАС ПРОИСХОДИТ, и держать их в разных местах значит
выбирать наугад.

⚠️ **The kit is mandatory for storefront and staff screens alike.** It is what makes tenant
theming, counter density and dark mode work identically everywhere. Hand-rolled `<input>`
and `<button>` silently opt out of all three — this has already happened in `BookingForm`.

| Category | Components |
|---|---|
| Primitive | `Button`, `Text`, `Spinner` |
| Input | `Field`, `Checkbox`, `Select`, `RadioGroup`, `Segmented`, `Stepper`, `DateRange`, `AppearanceToggle` |
| Output | `Card`, `Table`, `Price`, `Badge`, `Message`, `KeyValue` |
| Layout | `Container`, `Grid`, `Stack`, `Modal`, `Disclosure` |
| Feedback | `Empty`, `Skeleton`, `Toast` (and the app's `ErrorCard`) |

⚠️ **No `Ui` prefix** — the directory already says it.

⚠️ Five names differ from an HTML element only by case — `<Button>`, `<Select>`,
`<Table>`, `<Text>`, `<Field>`. Vue resolves them by case and this works, but when reading
a template remember that the capitalised one is the kit and the lowercase one is the real
element. `scripts/check-kit-usage.sh` counts on exactly that distinction.

## Rules

- **Tokens only, never raw values.** Semantic (`--text-primary`, `--bg-surface`) and
  component (`--control-h`, `--card-pad`) tokens. A component that hard-codes a colour
  breaks the tenant theme and dark mode at once.
- **Height comes from `--control-h`**, never a literal. `[data-density='counter']` raises it
  to 60px because counter staff work in gloves; the admin default is 48px.
  **There is no second set of components** for the counter — same kit, different tokens.
- **Derived brand tokens are declared on `*`, not `:root`** — on `:root` an override inside
  a subtree would not apply, and a tenant theme could not paint part of a page.
- `vue/require-default-prop` is **off on purpose**: an undefined prop and a prop defaulted
  to empty are different states here.
- **Feedback has a shape rule:** `Toast` only for messages that need no action and are
  safe to miss ("saved", "link copied"). Form errors and shortage warnings use `Message`
  in the page flow — a toast disappears before it is read, and at the counter the staff
  member is looking at the customer, not the screen.

## ⚠️ Modal: `:open` и слот `#footer`

`Modal` — это Reka Dialog, и обе ошибки ниже **не падают ни на сборке, ни в консоли**:

```vue
<!-- НЕ РАБОТАЕТ: компонент отрисуется, диалог останется закрытым -->
<Modal v-if="x" @close="x = null"><template #actions>…</template></Modal>

<!-- Правильно -->
<Modal :open="!!x" @update:open="(v) => { if (!v) x = null }">
  <template #footer>…</template>
</Modal>
```

`#actions` — слот **Card**, не Modal: опечатка убирает кнопки из диалога целиком.
Кнопка, которая «ничего не делает», уже была на экране инвентаря.
`scripts/check-modal-usage.py` (в `make kit`) ловит оба случая.

## ⚠️ AppearanceToggle: один владелец атрибута `data-theme`

Переключатель светлой и тёмной темы — **одна иконочная кнопка**, и
состояние он берёт из `useAppearance`, а не из пропа: тема глобальна,
и второй источник правды разошёлся бы с первым.

⚠️ **Атрибут `data-theme` на `<html>` ставит только `useAppearance`.**
`/dev/kit` однажды ставил его сам через `useHead` со своим локальным
`ref` — два хозяина одного атрибута, причём `useHead` снимает тронутые
атрибуты при размонтировании, то есть уход со страницы кита сбрасывал
личную настройку в светлую. Плотность через `useHead` ставить правильно
(она и должна сниматься), оформление — нет.

⚠️ Иконка показывает **цель** нажатия, а не текущее состояние: в светлой
теме видна луна. Состояние читается скринридером из `aria-pressed`,
потому что по картинке его не прочитать.

## Adding a component

Check it is not an existing one with a prop, then add it to `/dev/kit` — the showcase is
the acceptance test. `test/contrast.test.ts` must stay green.
