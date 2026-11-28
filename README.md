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

Todos os CSS e JS de produção ficam nas suas pastas. As seis páginas continuam na raiz para manter suas URLs. A configuração da Vercel mantém compatibilidade com os caminhos antigos dos recursos ativos; os arquivos legados removidos continuam recuperáveis no histórico Git. A ordem de carregamento dos estilos foi preservada.

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

A capa compartilhada .sf-cover tem composição própria em css/cinema.css, sem depender das antigas classes hero. A Home usa o encontro entre mãe e bebê; Partos preserva a foto vertical da família no desktop e em tablets, com enquadramento central dedicado ao celular. O texto das categorias fica fora da fotografia. O portfólio mantém seis imagens iniciais em uma grade editorial e onze sob demanda. A exposição O instante integra os registros reais em três atos visíveis na página, com profundidade CSS 3D, navegação explícita e ampliação pelo visualizador existente. O álbum, a perspectiva antiga e o tour foram substituídos. As fotos da galeria são links funcionais sem JavaScript; o orçamento continua opcional e o WhatsApp permanece direto. O atalho flutuante não duplica um CTA visível.

## Manutenção

Antes de alterar layout, execute os testes e compare as seis páginas em 320, 390, 768 e 1440 px. Mantenha o WhatsApp direto disponível. Não publicar depoimentos, vídeos ou preços sem autorização.

## Auditoria de usabilidade

A galeria de Partos oferece ampliação nativa sem JavaScript. A página Ensaios mantém URLs de álbuns, histórico, foco e recuperação de falhas. O contato mobile prioriza as ações de contratação. A exposição não exige modal nem reprodução automática. As imagens de capa não têm animação de entrada que atrase sua apresentação. Consulte `docs/auditoria-ux.md` para decisões e limites da revisão.
