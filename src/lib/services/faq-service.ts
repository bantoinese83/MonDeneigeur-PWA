import { BaseService } from './base-service'

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'general' | 'technical' | 'billing' | 'service'
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateFAQData {
  question: string
  answer: string
  category: FAQItem['category']
  order?: number
  is_active?: boolean
}

export interface UpdateFAQData {
  question?: string
  answer?: string
  category?: FAQItem['category']
  order?: number
  is_active?: boolean
}

export class FAQService extends BaseService {
  async getFAQs(): Promise<FAQItem[]> {
    try {
      const { data, error } = await this.client
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch FAQs: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('FAQ service error:', error)
      throw new Error('Failed to fetch FAQ data')
    }
  }

  async getFAQsByCategory(category: FAQItem['category']): Promise<FAQItem[]> {
    try {
      const { data, error } = await this.client
        .from('faqs')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch FAQs by category: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('FAQ service error:', error)
      throw new Error('Failed to fetch FAQ data by category')
    }
  }

  async createFAQ(faqData: CreateFAQData): Promise<FAQItem> {
    try {
      const { data, error } = await this.client
        .from('faqs')
        .insert([{
          ...faqData,
          order_index: faqData.order || 0,
          is_active: faqData.is_active ?? true
        }])
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create FAQ: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('FAQ service error:', error)
      throw new Error('Failed to create FAQ')
    }
  }

  async updateFAQ(id: string, faqData: UpdateFAQData): Promise<FAQItem> {
    try {
      const { data, error } = await this.client
        .from('faqs')
        .update({
          ...faqData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update FAQ: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('FAQ service error:', error)
      throw new Error('Failed to update FAQ')
    }
  }

  async deleteFAQ(id: string): Promise<void> {
    try {
      const { error } = await this.client
        .from('faqs')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to delete FAQ: ${error.message}`)
      }
    } catch (error) {
      console.error('FAQ service error:', error)
      throw new Error('Failed to delete FAQ')
    }
  }

  async getDefaultFAQs(): Promise<FAQItem[]> {
    // Return default FAQs if no database data is available
    return [
      {
        id: '1',
        question: 'How do I reset my password?',
        answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. You\'ll receive an email with instructions to create a new password.',
        category: 'general',
        order: 1,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        question: 'How do I update my contact information?',
        answer: 'Go to Settings > Account to update your contact information. Changes are saved automatically.',
        category: 'general',
        order: 2,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        question: 'How do I schedule a service visit?',
        answer: 'Service visits are scheduled through your contract. Contact your service provider or administrator to request changes to your schedule.',
        category: 'service',
        order: 3,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        question: 'How do I track my service provider\'s location?',
        answer: 'If you\'re a client, you can view your service provider\'s location in real-time through the dashboard when they\'re on route.',
        category: 'service',
        order: 4,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards, bank transfers, and other approved payment methods. Payment options are configured in your contract.',
        category: 'billing',
        order: 5,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '6',
        question: 'How do I view my service history?',
        answer: 'Navigate to Service History in your dashboard to view all past service visits, including photos and completion notes.',
        category: 'service',
        order: 6,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '7',
        question: 'How do I report a service issue?',
        answer: 'Contact your service provider directly or use the support contact information below. Include photos and detailed description of the issue.',
        category: 'service',
        order: 7,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '8',
        question: 'How do I change my notification preferences?',
        answer: 'Go to Settings > Notifications to customize your email, push, and SMS notification preferences.',
        category: 'general',
        order: 8,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '9',
        question: 'What should I do if the app isn\'t working?',
        answer: 'Try refreshing the page, clearing your browser cache, or updating your browser. If the issue persists, contact technical support.',
        category: 'technical',
        order: 9,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '10',
        question: 'How do I export my data?',
        answer: 'Go to Settings > Privacy > Data Access to request an export of your personal data. This process may take up to 30 days.',
        category: 'general',
        order: 10,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '11',
        question: 'How do I delete my account?',
        answer: 'Contact support to request account deletion. Note that this action is irreversible and may affect your service contracts.',
        category: 'general',
        order: 11,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '12',
        question: 'What are the system requirements?',
        answer: 'The platform works on modern browsers (Chrome, Firefox, Safari, Edge) and requires JavaScript to be enabled. Mobile apps are available for iOS and Android.',
        category: 'technical',
        order: 12,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
  }
}

export const faqService = new FAQService() 