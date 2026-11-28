# Silvoney Filmmaker

Site estático em HTML, CSS e JavaScript. URLs públicas preservadas, incluindo /links (rewrite Vercel).

## Organização

```text
/
├── index.html           # Início
├── partos.html          # Portfólio de nascimento
├── ensaios.html         # Ensaios e retratos
├── sobre.html           # Sobre o fotógrafo
├── contato.html         # Contato e orçamento
├── links.html           # Links da bio
├── imersao.html         # Galeria virtual Entre instantes
├── assets/              # Fotografias, marcas e miniaturas
├── css/                 # Estilos
├── js/                  # Interações e Analytics
├── tests/               # Testes estáticos e de navegador
├── robots.txt
├── sitemap.xml
└── vercel.json
```

### CSS

| Arquivo | Responsabilidade |
|---|---|
| home.css | Base visual das páginas editoriais e Início |
| portfolio-base.css | Base histórica das páginas Partos e Ensaios |
| site-shell.css | Cabeçalho, navegação e estrutura compartilhada |
| editorial.css | Composição editorial compartilhada |
| partos.css / ensaios.css / portfolio.css / links.css | Layouts específicos |
| cinema.css / experience.css / motion.css | Capa editorial, exposição espacial e movimento |
| booking.css / conversion.css / contact-access.css | Orçamento e acesso ao contato |
| analytics.css | Privacidade |

### JavaScript

| Arquivo | Responsabilidade |
|---|---|
| navigation.js | Menu e foco |
| gallery.js / ensaios.js | Visualizadores e álbuns |
| experience.js | Exposição em três atos e interação espacial |
| motion.js | Movimento e visibilidade do atalho de contato |
| booking.js | Coberturas e orçamento |
| analytics-config.js / analytics.js | Configuração, consentimento e eventos |

Todos os CSS e JS de produção ficam nas suas pastas. As páginas existentes continuam na raiz para manter suas URLs. A configuração da Vercel mantém compatibilidade com os caminhos antigos dos recursos ativos; os arquivos legados removidos continuam recuperáveis no histórico Git. A ordem de carregamento dos estilos foi preservada.

## Testes

Com Node.js 20 ou superior, na raiz:
`node --test tests/static.test.cjs`

Testes em navegadores (dependências isoladas da implantação estática):
```sh
cd tests
npm install
npx playwright install chromium webkit
npm run browser
```

Valide também em Safari/iPhone e Chrome/Android físicos, inclusive navegador interno do Instagram, WhatsApp e consentimento. O Playwright não substitui dispositivos reais nem mede contratos fechados.

## Analytics

Não ativar js/analytics-config.js até confirmar o ID GA4, consentimento e desativação da medição otimizada automática de links externos e formulários. Não enviar tipo de parto, previsão, maternidade ou texto da conversa ao Analytics. Configurar eventos como cliques, não como confirmação de contrato.

## Decisões de experiência

A capa compartilhada .sf-cover tem composição própria em css/cinema.css, sem depender das antigas classes hero. A Home usa o encontro entre mãe e bebê; Partos preserva a foto vertical da família no desktop e em tablets, com enquadramento central dedicado ao celular. O texto das categorias fica fora da fotografia. O portfólio reúne seis imagens na exposição, dez registros adicionais sob demanda e a fotografia de capa, todos em uma única coleção de ampliação. A exposição O instante é o próprio portfólio, em três atos visíveis na página, com profundidade CSS 3D, navegação explícita e ampliação pelo visualizador existente. O álbum, a perspectiva antiga e o tour foram substituídos. As fotos da galeria são links funcionais sem JavaScript; o orçamento continua opcional e o WhatsApp permanece direto. O atalho flutuante não duplica um CTA visível.

## Manutenção

Antes de alterar layout, execute os testes e compare as seis páginas em 320, 390, 768 e 1440 px. Mantenha o WhatsApp direto disponível. Não publicar depoimentos, vídeos ou preços sem autorização.

## Auditoria de usabilidade

A galeria de Partos oferece ampliação nativa sem JavaScript. A página Ensaios mantém URLs de álbuns, histórico, foco e recuperação de falhas. O contato mobile prioriza as ações de contratação. A exposição não exige modal nem reprodução automática. As imagens de capa não têm animação de entrada que atrase sua apresentação. Consulte `docs/auditoria-ux.md` para decisões e limites da revisão.

A exposição usa três momentos contínuos, índice de links nativos, composição editorial alternada, movimento espacial discreto vinculado à rolagem e proporções próprias no celular. Não há carrossel, rolagem forçada ou dependência externa.

## Entre instantes

Galeria virtual independente em /imersao.html: sala com quatro paredes, piso e teto em CSS 3D, câmera com três posições e arraste horizontal, seis imagens originais e ampliação. Vista plana nativa disponível sem JavaScript e por preferência de movimento reduzido. Sem WebGL, bibliotecas ou fontes remotas. A experiência não altera a jornada comercial de Partos.

Validação desta versão: geometria da sala reproduzida em Chromium, oito larguras de 320 a 1440 px, três posições (24 cenários) com imagens de teste nas dimensões originais. Após limitar a altura real dos quadros, as duas imagens de cada posição ficaram nos limites e tiveram seus centros clicáveis. O navegador da Vercel e dispositivos físicos não foram validados.

### Imersão em tela inteira

A sala ocupa o viewport dinâmico, com controles sobrepostos fora das fotografias, rotação circular entre quatro paredes e uma última parede com acesso às coberturas. O modo plano permanece disponível. A câmera calcula a zona livre entre os controles e centraliza as obras. Validação geométrica em fixture Chromium com imagens de teste nas proporções originais: nove tamanhos, quatro posições (36 cenários), incluindo orientação horizontal; não equivale a validação integral do site publicado.
