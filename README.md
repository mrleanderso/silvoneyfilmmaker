# Silvoney Filmmaker

Site estático em HTML, CSS e JavaScript. URLs públicas preservadas, incluindo /links (rewrite Vercel).

## Organização

- HTML na raiz; arquivos de mídia em assets/.
- js/navigation.js: menu e foco; js/gallery.js: galeria de partos.
- js/ensaios.js: álbuns de ensaios; js/motion.js: animações.
- js/album3d.js: álbum interativo; js/booking.js: opções e orçamento.
- css/motion.css, css/booking.css e css/album3d.css: estilos dos módulos.
- css/partos.css: navegação contextual, confiança e modos do portfólio na página Partos.
- CSS anterior permanece enquanto não houver comparação visual de todas as páginas.
- Scripts antigos não são carregados pelas seis páginas atuais, mas foram preservados no histórico e na raiz para revisão de dependências externas.

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

Não ativar analytics-config.js até confirmar o ID GA4, consentimento e desativação da medição otimizada automática de links externos e formulários. Não enviar tipo de parto, previsão, maternidade ou texto da conversa ao Analytics. Configurar eventos como cliques, não como confirmação de contrato.

## Manutenção

Antes de alterar layout, execute os testes e compare as seis páginas em 320, 390, 768 e 1440 px. Mantenha o WhatsApp direto disponível. Não publicar depoimentos, vídeos ou preços sem autorização.
