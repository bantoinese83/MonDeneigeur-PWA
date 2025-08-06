import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { faqService, type CreateFAQData, type UpdateFAQData } from '../lib/services/faq-service'
import type { FAQItem } from '../lib/services/faq-service'

export const useFAQs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      try {
        return await faqService.getFAQs()
      } catch (error) {
        // Fallback to default FAQs if database is not available
        console.warn('Using default FAQs due to database error:', error)
        return await faqService.getDefaultFAQs()
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useFAQsByCategory = (category: FAQItem['category']) => {
  return useQuery({
    queryKey: ['faqs', category],
    queryFn: async () => {
      try {
        return await faqService.getFAQsByCategory(category)
      } catch (error) {
        // Fallback to default FAQs filtered by category
        console.warn('Using default FAQs by category due to database error:', error)
        const defaultFAQs = await faqService.getDefaultFAQs()
        return defaultFAQs.filter(faq => faq.category === category)
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCreateFAQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (faqData: CreateFAQData) => faqService.createFAQ(faqData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })
}

export const useUpdateFAQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, faqData }: { id: string; faqData: UpdateFAQData }) =>
      faqService.updateFAQ(id, faqData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })
}

export const useDeleteFAQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => faqService.deleteFAQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })
} 