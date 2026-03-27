# Hand-Drawn Design System — Regras para o Cursor

Stack: Next.js + TypeScript + Tailwind CSS

---

## Fontes

- Importe `Kalam` (700) e `Patrick Hand` (400) do Google Fonts.
- **Títulos** → `font-family: 'Kalam', cursive; font-weight: 700`
- **Corpo / inputs / botões** → `font-family: 'Patrick Hand', cursive`
- Nunca use fontes do sistema ou sans-serif em nenhum elemento visível da UI.

---

## Tokens de Cor

Cores definidas em HSL sem o wrapper `hsl()`, permitindo uso do canal alpha com `/` no Tailwind (`bg-sketch-fg/40`, `text-sketch-accent/80`, etc.).

### Valores HSL

| Token              | HSL                  | Uso                                |
|--------------------|----------------------|------------------------------------|
| `sketch-bg`        | `40 33% 98%`         | Fundo da página                    |
| `sketch-fg`        | `0 0% 18%`           | Texto, bordas, sombras             |
| `sketch-muted`     | `37 18% 87%`         | Superfícies secundárias / apagadas |
| `sketch-accent`    | `256 58% 53%`        | Botões CTA, destaques principais   |
| `sketch-accent-lt` | `258 55% 94%`        | Destaques claros / seleção         |
| `sketch-yellow`    | `54 100% 88%`        | Cards estilo post-it / sticky note |
| `sketch-success`   | `145 43% 49%`        | Cor de sucesso / filled            |
| `sketch-danger`    | `0 100% 65%`         | Cor de erro / perigo               |

### Configuração — `globals.css`

```css
:root {
  --sketch-bg:        40 33% 98%;
  --sketch-fg:        0 0% 18%;
  --sketch-muted:     37 18% 87%;
  --sketch-accent:    256 58% 53%;
  --sketch-accent-lt: 258 55% 94%;
  --sketch-yellow:    54 100% 88%;
  --sketch-success:   145 43% 49%;
  --sketch-danger:    0 100% 65%;
}
```

### Configuração — `tailwind.config.ts`

```ts
theme: {
  extend: {
    colors: {
      sketch: {
        bg: 'hsl(var(--sketch-bg) / <alpha-value>)',
        fg: 'hsl(var(--sketch-fg) / <alpha-value>)',
        muted: 'hsl(var(--sketch-muted) / <alpha-value>)',
        accent: 'hsl(var(--sketch-accent) / <alpha-value>)',
        'accent-lt': 'hsl(var(--sketch-accent-lt) / <alpha-value>)',
        yellow: 'hsl(var(--sketch-yellow) / <alpha-value>)',
        success: 'hsl(var(--sketch-success) / <alpha-value>)',
        danger: 'hsl(var(--sketch-danger) / <alpha-value>)',
      },
    },
  },
}
```

### Exemplos de uso com alpha

```tsx
bg-sketch-fg/10      // fundo levíssimo de tinta
text-sketch-accent   // cor de destaque principal
border-sketch-fg/40  // borda semitransparente
bg-sketch-bg/60      // fundo translúcido (overlays)
```

---

## Border Radius — REGRA CRÍTICA

> **Nunca use as classes padrão `rounded-*` do Tailwind sozinhas.**  
> Sempre aplique border-radius assimétrico e irregular via prop `style` ou variável CSS.

### Presets (adicione ao `tailwind.config.ts` → `borderRadius`)

```ts
borderRadius: {
  'sketch-card':    'var(--sketch-radius-card)',
  'sketch-wobbly':  'var(--sketch-radius-wobbly)',
  'sketch-btn':     'var(--sketch-radius-btn)',
  'sketch-notif':   'var(--sketch-radius-notif)',
  'sketch-progress':'var(--sketch-radius-progress)',
}
```

Use `rounded-sketch-wobbly` para elementos grandes, `rounded-sketch-card` para cards e `rounded-sketch-btn` para botões.  
Para casos pontuais, passe `style={{ borderRadius: '...' }}` com valores assimétricos.

---

## Bordas

- **Mínimo**: `border-2` (2px). Use `border-[3px]` ou `border-4` para ênfase.
- **Cor**: sempre uma variação de tinta (`border-sketch-fg`).
- **Estilo**: `border-solid` como padrão; `border-dashed` para elementos secundários e divisores.
- Todo container visível deve ter borda — nenhum card sem borda.

---

## Sombras — REGRA CRÍTICA

> **Sem blur. Proibido usar `shadow-md`, `shadow-lg` etc.**  
> Use apenas sombras com offset sólido e zero blur.

### Configuração — `tailwind.config.ts`

```ts
boxShadow: {
  'sketch':    'var(--sketch-shadow)',
  'sketch-sm': 'var(--sketch-shadow-sm)',
  'sketch-lg': 'var(--sketch-shadow-lg)',
}
```

### Presets de Uso

| Tipo      | Tailwind Class     | Valor (box-shadow)                              |
|-----------|--------------------|-------------------------------------------------|
| Padrão    | `shadow-sketch`    | `4px 4px 0px 0px hsl(var(--sketch-border))`     |
| Suave     | `shadow-sketch-sm` | `3px 3px 0px 0px hsl(var(--sketch-border))`     |
| Ênfase    | `shadow-sketch-lg` | `6px 6px 0px 0px hsl(var(--sketch-border))`     |
| Ativo     | `shadow-none`      | `none` (botão pressionado)                      |

---

## Botões

```tsx
// Primário
className="
  rounded-sketch-wobbly
  border-[3px] border-sketch-fg
  bg-sketch-white text-sketch-fg
  shadow-sketch
  font-['Patrick_Hand'] text-lg
  px-6 py-3 min-h-[48px]
  transition-all duration-100
  hover:bg-sketch-accent hover:text-sketch-white hover:shadow-sketch-2 hover:translate-x-[2px] hover:translate-y-[2px]
  active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
"

// Secundário
// Igual ao primário, mas bg-sketch-muted e hover:bg-sketch-accent hover:text-sketch-white
```

---

## Cards / Containers

- Fundo: `sketch-white` (ou `sketch-yellow` para estilo post-it).
- Borda: `border-2 border-sketch-fg rounded-sketch-card`.
- Sombra: `shadow-sketch-sm`.
- Decorações opcionais:
  - `tape` — faixa cinza translúcida no topo, levemente rotacionada.
  - `pin` — use o componente `<Pin />` posicionado absolutamente no topo central do card.
- Aplique rotação pequena para irregularidade visual: `rotate-1` ou `-rotate-2`.
- No hover: `hover:rotate-1` ou `hover:-rotate-2` + aumento da sombra para `hover:shadow-sketch-lg`.

---

## Inputs

```tsx
className="
  w-full rounded-sketch-wobbly
  border-2 border-sketch-fg bg-sketch-white
  font-['Patrick_Hand'] text-base text-sketch-fg
  placeholder:text-sketch-fg/40
  px-4 py-2
  focus:outline-none focus:border-sketch-accent focus:ring-2 focus:ring-sketch-accent/20
"
```

---

## Escala Tipográfica

```
Título da página:  text-5xl md:text-6xl  font-['Kalam'] font-bold
Título de seção:   text-4xl md:text-5xl  font-['Kalam'] font-bold
Título de card:    text-2xl md:text-3xl  font-['Kalam'] font-bold
Corpo:             text-base md:text-xl  font-['Patrick_Hand']
Botão:             text-lg md:text-2xl   font-['Patrick_Hand']
```

Os títulos devem variar bastante de tamanho para parecer anotações enfatizadas à mão.

---

## Layout

- Largura máxima: `max-w-5xl mx-auto` para conteúdo de página; `max-w-3xl` para conteúdo focado ou formulários.
- Padding vertical de seção: `py-20`.
- Gap em grids: `gap-8`.
- Grids colapsam para 1 coluna no mobile → `grid-cols-1 md:grid-cols-2` ou `md:grid-cols-3`.

---

## Rotação e Imperfeição

- Aplique `rotate-1` ou `-rotate-2` em cards, imagens e elementos decorativos.
- Nunca alinhe tudo em uma grade perfeita — use rotação e pequenos deslocamentos para quebrar a rigidez.
- Sobreponha elementos com margens negativas quando apropriado (ex: avatares empilhados: `-space-x-4`).

---

## Textura de Fundo

Aplique no `<body>` raiz ou no wrapper da página:

```css
background-color: hsl(var(--sketch-bg));
background-image: radial-gradient(hsl(var(--sketch-muted) / 1) 1px, transparent 1px);
background-size: 24px 24px;
```

---

## Elementos Decorativos

Use para reforçar o estilo desenhado à mão. Oculte no mobile com `hidden md:block`.

- **Setas tracejadas**: SVG inline com `stroke-dasharray`.
- **Linhas onduladas**: SVG path conectando seções.
- **Fita adesiva (tape)**: `<div>` com `bg-gray-300/40 rotate-[-2deg]` posicionado absolutamente.
- **Percevejo (pin)**: use o componente `<Pin />` no topo do card — não criar círculos manuais.
- **Círculos tracejados**: `border-dashed border-2 border-sketch-accent rounded-full` posicionados absolutamente.

---

## Ícones

- Biblioteca: `lucide-react`.
- Sempre use `strokeWidth={2.5}` ou `strokeWidth={3}`.
- Envolva ícones principais em um círculo irregular: `rounded-sketch-wobbly border-2 border-sketch-fg p-2`.

---

## Animações

- Transição padrão: `transition-transform duration-100` (rápida e física).
- Bounce decorativo: `animate-bounce` com `duration-[3000ms]` em blobs decorativos.
- Jiggle no hover: `hover:rotate-1` ou `hover:-rotate-2`.
- Sem fades, sem transições com blur, sem easing lento — mantenha tudo rápido e físico.

---

## Regras Responsivas

| Situação               | Regra                                                        |
|------------------------|--------------------------------------------------------------|
| SVGs decorativos       | `hidden md:block`                                            |
| Alvos de toque         | `min-h-[48px]` em todos os elementos interativos             |
| Tamanho de títulos     | Sempre use as classes mobile e `md:` juntas                  |
| Rotação                | Mantenha em todos os breakpoints; reduza a magnitude se necessário |
| Sombras                | Nunca adicione blur em nenhum breakpoint                     |
| Bordas irregulares     | Mantenha em todos os breakpoints — é o núcleo da estética    |

---

## O Que NÃO Fazer

- ❌ `rounded-md`, `rounded-lg`, `rounded-full` sem override assimétrico
- ❌ `shadow-md`, `shadow-lg`, `shadow-xl` (sombras com blur)
- ❌ `font-sans`, `font-mono`, fontes do sistema
- ❌ Preto puro (`#000000`) — use `sketch-fg`
- ❌ Cards sem borda
- ❌ Animações lentas (`duration-500+`) em elementos interativos
- ❌ Layouts perfeitamente centralizados e simétricos sem rotação ou imperfeição
