import { supabase } from './supabase'

/**
 * Configura o bucket de storage para produtos
 * Execute este script uma vez para criar o bucket
 */
export async function setupStorageBucket() {
  try {
    // Verificar se o bucket já existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Erro ao listar buckets:', listError)
      return { success: false, error: listError }
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'natal-produtos')

    if (bucketExists) {
      console.log('✅ Bucket "natal-produtos" já existe')
      return { success: true, message: 'Bucket já existe' }
    }

    // Criar o bucket
    const { data, error } = await supabase.storage.createBucket('natal-produtos', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    })

    if (error) {
      console.error('❌ Erro ao criar bucket:', error)
      return { success: false, error }
    }

    console.log('✅ Bucket "natal-produtos" criado com sucesso!')
    return { success: true, data }
  } catch (error) {
    console.error('❌ Erro inesperado:', error)
    return { success: false, error }
  }
}

/**
 * Verifica se o bucket existe e está acessível
 */
export async function checkStorageBucket() {
  try {
    const { data, error } = await supabase.storage.getBucket('natal-produtos')
    
    if (error) {
      return { exists: false, error }
    }

    return { exists: true, bucket: data }
  } catch (error) {
    return { exists: false, error }
  }
}
