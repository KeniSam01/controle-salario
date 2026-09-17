# Controle de Salário — PWA para iPhone

Versão web instalável do aplicativo de controle financeiro.

## Recursos
- Salário mensal
- Gastos e categorias
- Total gasto
- Saldo disponível
- Percentual do salário usado
- Gráfico por categoria
- Dados salvos no aparelho com localStorage
- Interface responsiva
- Dark Mode
- PWA instalável na Tela de Início do iPhone
- Funciona offline depois do primeiro carregamento

## Importante
Para instalar como PWA no iPhone, os arquivos precisam estar publicados em um endereço HTTPS.

Uma forma gratuita é usar GitHub Pages:
1. Crie uma conta no GitHub.
2. Crie um repositório público.
3. Envie todos os arquivos desta pasta, mantendo `manifest.webmanifest` e `sw.js` na raiz.
4. Ative Settings → Pages → Deploy from a branch → main → /(root).
5. Abra o endereço HTTPS gerado no Safari do iPhone.
6. Toque em Compartilhar → Adicionar à Tela de Início → Adicionar.

O projeto não envia seus dados para servidor. Os lançamentos ficam no armazenamento local do navegador/aparelho.
