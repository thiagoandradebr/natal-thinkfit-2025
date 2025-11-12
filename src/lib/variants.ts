import { Produto, VariacaoProduto } from '@/types/database'

/**
 * Cria uma variação virtual para um produto quando não há variações cadastradas
 */
export function createVirtualVariant(produto: Produto): VariacaoProduto {
  return {
    id: `virtual-${produto.id}`,
    produto_id: produto.id,
    nome_variacao: produto.tamanho || 'Padrão',
    descricao: produto.descricao_curta || '',
    preco: produto.preco,
    is_default: true,
    ordem_exibicao: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

/**
 * Processa variações de um produto:
 * - Se houver variações reais, retorna elas
 * - Se não houver, cria uma variação virtual
 */
export function processVariants(
  produto: Produto,
  allVariants: VariacaoProduto[]
): VariacaoProduto[] {
  const produtoVariants = allVariants.filter(v => v.produto_id === produto.id)
  
  if (produtoVariants.length > 0) {
    return produtoVariants
  }
  
  // Se não houver variações, criar variação virtual
  return [createVirtualVariant(produto)]
}

/**
 * Seleciona a variação padrão ou primeira disponível
 */
export function getDefaultVariant(variants: VariacaoProduto[]): VariacaoProduto | null {
  if (variants.length === 0) return null
  
  // Buscar variação padrão
  const defaultVariant = variants.find(v => v.is_default)
  if (defaultVariant) return defaultVariant
  
  // Se não houver padrão, retornar primeira
  return variants[0]
}

/**
 * Cria um mapa de variações por produto_id para acesso rápido
 */
export function createVariantsMap(
  produtos: Produto[],
  allVariants: VariacaoProduto[]
): Map<string, VariacaoProduto[]> {
  const map = new Map<string, VariacaoProduto[]>()
  
  produtos.forEach(produto => {
    const variants = processVariants(produto, allVariants)
    map.set(produto.id, variants)
  })
  
  return map
}

