# Auditoria de experiência — Silvoney Filmmaker

## Objetivo
Reduzir atrito na jornada Instagram → portfólio → orçamento, preservar fotografia, privacidade, identidade editorial e interação 3D voluntária.

| Página | Achado / decisão |
|---|---|
| Início | Capa e portfólio preservados; CTA final descreve a ação real de escolher serviço. |
| Partos | Removido bloqueio de clique sem JS, informação de seis fotos em destaque e 17 no total, foco e recuperação do visualizador, orçamento opcional acessível por hash. |
| Ensaios | Quatro opções em quatro colunas no desktop e duas no celular; histórico e acesso direto a álbuns; retorno de foco; tratamento e recuperação de falha de foto. |
| Sobre | Texto revisado sem alterar fatos; retrato original preservado. |
| Contato | Opções de orçamento antes da fotografia no mobile; foto carregada sob demanda; rótulos claros. |
| Links | Duas primeiras ações mantidas (Partos e WhatsApp); cabeçalho compacto; tour voluntário. |

## IHC e acessibilidade
- Correspondência com o mundo real: ações descrevem destinos e não prometem confirmação de reserva.
- Controle: navegação nativa sem JavaScript, movimento reduzido, Escape e retorno de foco, opção de não selecionar cobertura.
- Reconhecimento: opções de álbum explícitas, contadores claros, informação progressiva.
- Recuperação: mensagens e nova tentativa para imagens indisponíveis.
- Consistência: menu compartilhado e versões sincronizadas dos recursos alterados.
- Privacidade: nenhum dado de maternidade ou previsão enviado ao Analytics; medição continua desativada sem ID. Atalho flutuante não cobre painel de consentimento.
- Performance: tour removido de Ensaios por ausência de diálogo e gatilhos; removida animação de entrada da capa; mídia original não modificada.

## Limites
A revisão abrangeu o inventário completo, as seis páginas, os dez módulos JavaScript e verificações estruturais das 16 folhas de estilo, incluindo seletores sensíveis. Não é certificação WCAG, teste com clientes, auditoria visual integral ou medição Lighthouse. Os arquivos CSS históricos permanecem quando sua remoção depender de comparação de renderização. Os testes de navegador foram ampliados, mas dependem da execução em ambiente com o repositório completo e Playwright. A Vercel não pôde ser acessada pelo ambiente da revisão. Nenhuma conversão ou ganho de desempenho foi medido.

## Evolução da experiência fotográfica

O álbum tridimensional, o carrossel em perspectiva e o tour anterior foram substituídos pela exposição O instante. A experiência aparece diretamente em Partos, sem exigir uma abertura ou substituir a galeria normal. Seis fotografias reais foram selecionadas em três atos temáticos, sem sugerir que todas pertencem à mesma família. As fotos mantêm sua proporção; o espaço utiliza CSS 3D, sem WebGL, dependências ou reprodução automática. Navegação por botões, teclado e toque; respeito a movimento reduzido e links nativos como alternativa. O link da bio conduz à exposição. A medição de interesse continua desativada até configuração de consentimento e GA4.

## Integração e redução de redundâncias

Uma única coleção com 17 fotografias (capa, seis na exposição e dez adicionais); filme com imagem independente. Nenhuma fotografia repetida no conteúdo principal. A âncora #galeria abre os registros complementares com JavaScript, e continua chegando ao controle nativo sem JavaScript. A ação de orçamento permanece direta na capa e nas coberturas; o encerramento retorna ao orçamento, preservando a seleção. Processo e dúvidas concentram informações complementares. A página mantém os endereços e âncoras anteriores.

## Refinamento de direção de arte

O palco da exposição ocupa a largura editorial disponível. As fotografias usam caixas proporcionais a cada formato e uma composição vertical dedicada a telas pequenas. Os controles antecedem a obra e a ação selecionada tem contraste e indicador. A tipografia serifada utiliza fontes locais com fallback, mantendo o preto e branco e evitando dependências externas. Sem novos modos ou imagens duplicadas.
