'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ images, onImagesChange, maxImages = 4 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Verificar limite de imagens
    if (images.length + files.length > maxImages) {
      alert(`Você pode adicionar no máximo ${maxImages} imagens`)
      return
    }

    setUploading(true)
    const newImages: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} não é uma imagem válida`)
          continue
        }

        // Validar tamanho (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} é muito grande. Máximo 5MB`)
          continue
        }

        // Gerar nome único
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `produtos/${fileName}`

        // Upload para Supabase Storage
        const { data, error } = await supabase.storage
          .from('natal-produtos')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('Erro no upload:', error)
          alert(`Erro ao fazer upload de ${file.name}`)
          continue
        }

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('natal-produtos')
          .getPublicUrl(filePath)

        newImages.push(publicUrl)
        setUploadProgress(((i + 1) / files.length) * 100)
      }

      // Atualizar lista de imagens
      onImagesChange([...images, ...newImages])
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Erro ao processar upload:', error)
      alert('Erro ao fazer upload das imagens')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const removeImage = async (index: number) => {
    const imageUrl = images[index]
    
    // Tentar extrair o caminho do arquivo da URL
    try {
      const urlParts = imageUrl.split('/natal-produtos/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        
        // Deletar do storage
        await supabase.storage
          .from('natal-produtos')
          .remove([filePath])
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error)
    }

    // Remover da lista
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const input = fileInputRef.current
      if (input) {
        input.files = files
        handleFileSelect({ target: input } as any)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxImages}
          className="hidden"
          id="image-upload"
        />
        
        <label
          htmlFor="image-upload"
          className={`block border-2 border-dashed border-beige-medium bg-beige-lightest p-8 text-center cursor-pointer transition-all hover:border-gold-warm hover:bg-white ${
            uploading || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <>
                <Loader2 className="text-wine animate-spin" size={40} />
                <p className="font-body text-sm text-brown-medium">
                  Fazendo upload... {Math.round(uploadProgress)}%
                </p>
              </>
            ) : (
              <>
                <Upload className="text-brown-medium" size={40} />
                <div>
                  <p className="font-body text-sm text-brown-darkest font-medium mb-1">
                    Clique para fazer upload ou arraste as imagens
                  </p>
                  <p className="font-body text-xs text-brown-medium">
                    PNG, JPG, WEBP até 5MB • Máximo {maxImages} imagens
                  </p>
                </div>
              </>
            )}
          </div>
        </label>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-beige-medium h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${uploadProgress}%` }}
            className="h-full bg-gradient-to-r from-wine to-wine-dark"
          />
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square bg-beige-lightest group overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay com botão de remover */}
                <div className="absolute inset-0 bg-brown-darkest/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.button
                    type="button"
                    onClick={() => removeImage(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-wine text-white p-3 shadow-lg"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Badge de ordem */}
                <div className="absolute top-2 left-2 bg-gold-warm text-white w-6 h-6 flex items-center justify-center text-xs font-body font-medium">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Info */}
      {images.length > 0 && (
        <p className="font-body text-xs text-brown-medium text-center">
          {images.length} de {maxImages} imagens • A primeira imagem será a capa do produto
        </p>
      )}
    </div>
  )
}
