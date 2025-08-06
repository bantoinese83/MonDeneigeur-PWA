export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'superadmin' | 'admin' | 'employee' | 'client'
          company_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'superadmin' | 'admin' | 'employee' | 'client'
          company_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'superadmin' | 'admin' | 'employee' | 'client'
          company_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          profile_id: string
          company_id: string
          position: string | null
          hire_date: string | null
          salary: number | null
          status: 'active' | 'inactive' | 'terminated'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          company_id: string
          position?: string | null
          hire_date?: string | null
          salary?: number | null
          status?: 'active' | 'inactive' | 'terminated'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          company_id?: string
          position?: string | null
          hire_date?: string | null
          salary?: number | null
          status?: 'active' | 'inactive' | 'terminated'
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          company_id: string
          profile_id: string
          address: string | null
          service_area: string | null
          contact_preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          profile_id: string
          address?: string | null
          service_area?: string | null
          contact_preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          profile_id?: string
          address?: string | null
          service_area?: string | null
          contact_preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          company_id: string
          client_id: string
          contract_number: string | null
          service_type: string | null
          start_date: string | null
          end_date: string | null
          terms: string | null
          pdf_url: string | null
          status: 'draft' | 'active' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          client_id: string
          contract_number?: string | null
          service_type?: string | null
          start_date?: string | null
          end_date?: string | null
          terms?: string | null
          pdf_url?: string | null
          status?: 'draft' | 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          client_id?: string
          contract_number?: string | null
          service_type?: string | null
          start_date?: string | null
          end_date?: string | null
          terms?: string | null
          pdf_url?: string | null
          status?: 'draft' | 'active' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          company_id: string
          employee_id: string
          route_name: string | null
          description: string | null
          assigned_date: string | null
          status: 'pending' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          employee_id: string
          route_name?: string | null
          description?: string | null
          assigned_date?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          employee_id?: string
          route_name?: string | null
          description?: string | null
          assigned_date?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      service_visits: {
        Row: {
          id: string
          route_id: string
          client_id: string
          employee_id: string
          scheduled_date: string | null
          completed_at: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          notes: string | null
          photos: Json | null
          gps_coordinates: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          route_id: string
          client_id: string
          employee_id: string
          scheduled_date?: string | null
          completed_at?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          notes?: string | null
          photos?: Json | null
          gps_coordinates?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          route_id?: string
          client_id?: string
          employee_id?: string
          scheduled_date?: string | null
          completed_at?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          notes?: string | null
          photos?: Json | null
          gps_coordinates?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gps_logs: {
        Row: {
          id: string
          employee_id: string
          visit_id: string | null
          latitude: number | null
          longitude: number | null
          accuracy: number | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          visit_id?: string | null
          latitude?: number | null
          longitude?: number | null
          accuracy?: number | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          visit_id?: string | null
          latitude?: number | null
          longitude?: number | null
          accuracy?: number | null
          timestamp?: string
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type UserRole = Database['public']['Tables']['profiles']['Row']['role']
export type Company = Database['public']['Tables']['companies']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Employee = Database['public']['Tables']['employees']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Contract = Database['public']['Tables']['contracts']['Row']
export type Route = Database['public']['Tables']['routes']['Row']
export type ServiceVisit = Database['public']['Tables']['service_visits']['Row']
export type GpsLog = Database['public']['Tables']['gps_logs']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'] 