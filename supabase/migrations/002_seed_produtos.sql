-- Seed de produtos do Cardápio de Natal ThinkFit 2025

INSERT INTO produtos (nome, slug, descricao_curta, descricao_longa, preco, tamanho, fotos, destaque, status, ordem, quantidade_estoque) VALUES
(
  'Red Velvet',
  'red-velvet',
  'Massa Red Velvet com recheio de cream cheese e geleia de frutas vermelhas.',
  'MASSA RED VELVET, DUPLO RECHEIO DE BRIGADEIRO DE CREAM CHEESE E GELEIA DE FRUTAS VERMELHAS. COBERTURA DE GANACHE DE CHOCOLATE BRANCO. SEM GLÚTEN, ZERO LACTOSE, LOW SUGAR.',
  417.00,
  '22 cm',
  ARRAY['/images/products/red-velvet/1.jpg', '/images/products/red-velvet/2.jpg'],
  true,
  'disponivel',
  1,
  20
),
(
  'Dark Cacau',
  'dark-cacau',
  'Bolo de chocolate intenso com recheio de brigadeiro dark.',
  'MASSA DE CHOCOLATE DARK 70%, RECHEIO DE BRIGADEIRO DE CHOCOLATE BELGA DARK. COBERTURA DE GANACHE DARK. SEM GLÚTEN, ZERO LACTOSE, LOW SUGAR.',
  397.00,
  '22 cm',
  ARRAY['/images/products/dark-cacau/1.jpg', '/images/products/dark-cacau/2.jpg'],
  true,
  'disponivel',
  2,
  20
),
(
  'Vanilla Dream',
  'vanilla-dream',
  'Bolo de baunilha com recheio de creme de baunilha Madagascar.',
  'MASSA DE BAUNILHA MADAGASCAR, RECHEIO DE CREME DE BAUNILHA E FRUTAS VERMELHAS. COBERTURA DE CHANTILLY DE COCO. SEM GLÚTEN, ZERO LACTOSE, LOW SUGAR.',
  387.00,
  '22 cm',
  ARRAY['/images/products/vanilla-dream/1.jpg', '/images/products/vanilla-dream/2.jpg'],
  false,
  'disponivel',
  3,
  15
),
(
  'Cake Árvore de Natal',
  'cake-arvore-natal',
  'Bolo decorado em formato de árvore de Natal com detalhes comestíveis.',
  'MASSA DE CHOCOLATE COM ESPECIARIAS NATALINAS, RECHEIO DE BRIGADEIRO DE PISTACHE. DECORAÇÃO ARTESANAL EM FORMATO DE ÁRVORE DE NATAL COM DETALHES COMESTÍVEIS. SEM GLÚTEN, ZERO LACTOSE, LOW SUGAR.',
  457.00,
  '15 cm altura',
  ARRAY['/images/products/cake-arvore-natal/1.jpg', '/images/products/cake-arvore-natal/2.jpg'],
  true,
  'disponivel',
  4,
  10
),
(
  'Brownie Guirlanda',
  'brownie-guirlanda',
  'Brownie em formato de guirlanda com frutas vermelhas e pistache.',
  'BROWNIE DARK CHOCOLATE EM FORMATO DE GUIRLANDA NATALINA. DECORADO COM FRUTAS VERMELHAS FRESCAS, PISTACHE E RASPAS DE CHOCOLATE BRANCO. SEM GLÚTEN, ZERO LACTOSE, LOW SUGAR.',
  297.00,
  '20 cm diâmetro',
  ARRAY['/images/products/brownie-guirlanda/1.jpg', '/images/products/brownie-guirlanda/2.jpg'],
  false,
  'disponivel',
  5,
  25
),
(
  'Mousse Natalina',
  'mousse-natalina',
  'Mousse de chocolate branco com frutas vermelhas e especiarias.',
  'MOUSSE DE CHOCOLATE BRANCO COM TOQUE DE CANELA E CARDAMOMO. CAMADAS DE GELEIA DE FRUTAS VERMELHAS. BASE DE BROWNIE CROCANTE. SEM GLÚTEN, ZERO LACTOSE, LOW SUGAR.',
  347.00,
  'Porção 6-8 pessoas',
  ARRAY['/images/products/mousse-natalina/1.jpg', '/images/products/mousse-natalina/2.jpg'],
  false,
  'disponivel',
  6,
  15
)
ON CONFLICT (slug) DO NOTHING;
