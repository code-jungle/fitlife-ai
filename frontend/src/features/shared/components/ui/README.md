# UI Components

Esta pasta contém todos os componentes de UI reutilizáveis do aplicativo.

## Estrutura Proposta

```
src/features/shared/components/ui/
├── layout/                 # Componentes de layout
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   ├── Navigation.tsx
│   └── PageLayout.tsx
├── forms/                  # Componentes de formulário
│   ├── FormField.tsx
│   ├── FormGroup.tsx
│   ├── FormError.tsx
│   └── FormLabel.tsx
├── feedback/               # Componentes de feedback
│   ├── Toast.tsx
│   ├── Alert.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   └── EmptyState.tsx
├── data-display/           # Componentes de exibição de dados
│   ├── Table.tsx
│   ├── Card.tsx
│   ├── List.tsx
│   ├── Grid.tsx
│   └── VirtualizedList.tsx
├── navigation/             # Componentes de navegação
│   ├── Breadcrumb.tsx
│   ├── Pagination.tsx
│   ├── Tabs.tsx
│   └── Menu.tsx
├── overlay/                # Componentes de sobreposição
│   ├── Modal.tsx
│   ├── Dialog.tsx
│   ├── Popover.tsx
│   ├── Tooltip.tsx
│   └── Drawer.tsx
├── input/                  # Componentes de entrada
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Radio.tsx
│   ├── Switch.tsx
│   └── Slider.tsx
├── buttons/                # Componentes de botão
│   ├── Button.tsx
│   ├── IconButton.tsx
│   ├── ButtonGroup.tsx
│   └── ToggleButton.tsx
├── media/                  # Componentes de mídia
│   ├── Image.tsx
│   ├── Video.tsx
│   ├── Avatar.tsx
│   └── Icon.tsx
└── index.ts                # Barrel exports
```

## Benefícios

1. **Reutilização**: Componentes podem ser usados em qualquer feature
2. **Consistência**: Design system unificado
3. **Manutenibilidade**: Mudanças centralizadas
4. **Testabilidade**: Componentes isolados e testáveis
5. **Documentação**: Cada componente tem sua própria documentação
6. **Acessibilidade**: Padrões de acessibilidade centralizados

