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
