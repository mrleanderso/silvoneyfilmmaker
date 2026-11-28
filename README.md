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
| cinema.css / album3d.css / motion.css | Experiências fotográficas e movimento |
| booking.css / conversion.css / contact-access.css | Orçamento e acesso ao contato |
| tour.css / analytics.css | Tour e privacidade |

### JavaScript

| Arquivo | Responsabilidade |
|---|---|
| navigation.js | Menu e foco |
| gallery.js / ensaios.js | Visualizadores e álbuns |
| cinema.js / album3d.js | Portfólio em perspectiva e livro 3D |
| motion.js | Movimento e visibilidade do atalho de contato |
| booking.js | Coberturas e orçamento |
| tour.js | Tour fotográfico |
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

A capa compartilhada .sf-cover tem composição própria em css/cinema.css, sem depender das antigas classes hero. A Home usa o encontro entre mãe e bebê; Partos preserva a foto vertical da família no desktop e em tablets, com enquadramento central dedicado ao celular. O texto das categorias fica fora da fotografia. O portfólio mantém seis imagens iniciais em uma grade editorial e onze sob demanda. O portfólio normal é padrão e os modos 3D são voluntários. A foto central da perspectiva e o link de ampliação do álbum abrem o mesmo visualizador acessível. A navegação do livro preserva o foco nos limites e carrega páginas adjacentes sob demanda. As fotos da galeria são links funcionais sem JavaScript; o orçamento continua opcional e o WhatsApp permanece direto. O atalho flutuante não duplica um CTA visível.

## Manutenção

Antes de alterar layout, execute os testes e compare as seis páginas em 320, 390, 768 e 1440 px. Mantenha o WhatsApp direto disponível. Não publicar depoimentos, vídeos ou preços sem autorização.
