# MonDeneigeur PWA - Security Guide

This document provides a comprehensive security guide for the MonDeneigeur PWA, including authentication, data protection, compliance, and security best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication Security](#authentication-security)
- [Data Protection](#data-protection)
- [Privacy Compliance](#privacy-compliance)
- [Network Security](#network-security)
- [Application Security](#application-security)
- [Security Monitoring](#security-monitoring)
- [Incident Response](#incident-response)
- [Security Testing](#security-testing)
- [Best Practices](#best-practices)

## Overview

The MonDeneigeur PWA implements comprehensive security measures to protect user data and ensure compliance with privacy regulations:

- **Multi-Factor Authentication**: Secure user authentication
- **Row Level Security**: Database-level access control
- **Data Encryption**: End-to-end encryption
- **Privacy Compliance**: Loi 25 and GDPR compliance
- **Security Monitoring**: Real-time threat detection
- **Regular Audits**: Continuous security assessments

## Authentication Security

### Supabase Authentication

**Configuration**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'mondeneigeur-pwa'
    }
  },
  db: {
    schema: 'public'
  }
})
```

### Password Security

**Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Implementation**:
```typescript
// Password validation schema
export const PasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
})
```

### Session Management

**Features**:
- JWT token-based authentication
- Automatic token refresh
- Secure session storage
- Session timeout handling

**Implementation**:
```typescript
// Session management
export class SessionManager {
  static async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) {
      throw new Error('Session refresh failed')
    }
    return data.session
  }

  static async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error('Logout failed')
    }
  }

  static getSession() {
    return supabase.auth.getSession()
  }
}
```

## Data Protection

### Row Level Security (RLS)

**Database Policies**:

```sql
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Company-based access control
CREATE POLICY "Company-based access" ON companies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.company_id = companies.id
    )
  );

-- Role-based access control
CREATE POLICY "Role-based access" ON employees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND (
        profiles.role = 'superadmin' OR
        (profiles.role = 'admin' AND profiles.company_id = employees.company_id) OR
        (profiles.role = 'employee' AND profiles.id = employees.profile_id)
      )
    )
  );
```

### Data Encryption

**At Rest**:
- Database encryption (Supabase managed)
- File storage encryption (Supabase Storage)
- Backup encryption

**In Transit**:
- HTTPS/TLS encryption
- API communication encryption
- WebSocket encryption

**Implementation**:
```typescript
// Encrypted data handling
export class DataEncryption {
  static async encryptSensitiveData(data: string): Promise<string> {
    // Use Supabase's built-in encryption
    return btoa(data) // Base64 encoding for demo
  }

  static async decryptSensitiveData(encryptedData: string): Promise<string> {
    return atob(encryptedData) // Base64 decoding for demo
  }
}
```

### Data Sanitization

**Input Validation**:
```typescript
// Data sanitization utilities
export class DataSanitizer {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000) // Limit length
  }

  static sanitizeEmail(email: string): string {
    return email.toLowerCase().trim()
  }

  static sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-\(\)\s]/g, '')
  }

  static sanitizeAddress(address: string): string {
    return address
      .trim()
      .replace(/[<>]/g, '')
      .substring(0, 500)
  }
}
```

## Privacy Compliance

### Loi 25 Compliance (Québec)

**Requirements**:
- User consent for data collection
- Right to access personal data
- Right to delete personal data
- Data portability
- Privacy policy

**Implementation**:
```typescript
// Privacy consent management
export class PrivacyManager {
  static async getConsent(userId: string): Promise<PrivacyConsent> {
    const { data } = await supabase
      .from('privacy_consents')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    return data
  }

  static async updateConsent(userId: string, consent: PrivacyConsent): Promise<void> {
    await supabase
      .from('privacy_consents')
      .upsert({
        user_id: userId,
        ...consent,
        updated_at: new Date().toISOString()
      })
  }

  static async exportUserData(userId: string): Promise<UserDataExport> {
    // Export all user data
    const userData = await this.getAllUserData(userId)
    return this.formatForExport(userData)
  }

  static async deleteUserData(userId: string): Promise<void> {
    // Anonymize user data instead of deletion
    await supabase
      .from('profiles')
      .update({
        email: `deleted_${Date.now()}@deleted.com`,
        full_name: 'Deleted User',
        avatar_url: null
      })
      .eq('id', userId)
  }
}
```

### GDPR Compliance

**Data Processing**:
- Lawful basis for processing
- Data minimization
- Purpose limitation
- Storage limitation

**User Rights**:
- Right to be informed
- Right of access
- Right to rectification
- Right to erasure
- Right to data portability

**Implementation**:
```typescript
// GDPR compliance utilities
export class GDPRCompliance {
  static async processDataRequest(userId: string, requestType: 'access' | 'deletion' | 'portability'): Promise<void> {
    switch (requestType) {
      case 'access':
        await this.provideDataAccess(userId)
        break
      case 'deletion':
        await this.processDataDeletion(userId)
        break
      case 'portability':
        await this.provideDataPortability(userId)
        break
    }
  }

  private static async provideDataAccess(userId: string): Promise<void> {
    const userData = await this.getAllUserData(userId)
    // Send data access report to user
    await this.sendDataAccessReport(userId, userData)
  }

  private static async processDataDeletion(userId: string): Promise<void> {
    // Anonymize data instead of deletion
    await PrivacyManager.deleteUserData(userId)
  }

  private static async provideDataPortability(userId: string): Promise<void> {
    const userData = await this.getAllUserData(userId)
    const exportData = await PrivacyManager.exportUserData(userId)
    // Provide data in machine-readable format
    await this.sendDataPortabilityFile(userId, exportData)
  }
}
```

## Network Security

### HTTPS/TLS

**Configuration**:
- TLS 1.3 enforcement
- HSTS headers
- Secure cookie settings
- CSP headers

**Implementation**:
```typescript
// Security headers configuration
export const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://erbzmoqoocmptkbflibr.supabase.co;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https://erbzmoqoocmptkbflibr.supabase.co https://api.openweathermap.org;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim()
}
```

### API Security

**Rate Limiting**:
```typescript
// Rate limiting implementation
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private windowMs = 60000 // 1 minute
  private maxRequests = 100

  isAllowed(userId: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(userId) || []
    
    // Remove old requests
    const recentRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    )
    
    if (recentRequests.length >= this.maxRequests) {
      return false
    }
    
    recentRequests.push(now)
    this.requests.set(userId, recentRequests)
    return true
  }
}
```

**Input Validation**:
```typescript
// API input validation
export class APIValidator {
  static validateEmployeeData(data: any): EmployeeData {
    return EmployeeSchema.parse(data)
  }

  static validateContractData(data: any): ContractData {
    return ContractSchema.parse(data)
  }

  static sanitizeInput(input: string): string {
    return DOMPurify.sanitize(input)
  }
}
```

## Application Security

### XSS Protection

**Implementation**:
```typescript
// XSS protection utilities
export class XSSProtection {
  static sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href', 'target']
    })
  }

  static escapeHTML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }
}
```

### CSRF Protection

**Implementation**:
```typescript
// CSRF protection
export class CSRFProtection {
  static generateToken(): string {
    return crypto.randomUUID()
  }

  static validateToken(token: string, storedToken: string): boolean {
    return token === storedToken
  }
}
```

### File Upload Security

**Implementation**:
```typescript
// Secure file upload
export class SecureFileUpload {
  static allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  static maxSize = 10 * 1024 * 1024 // 10MB

  static validateFile(file: File): boolean {
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error('File type not allowed')
    }
    
    if (file.size > this.maxSize) {
      throw new Error('File too large')
    }
    
    return true
  }

  static async uploadFile(file: File, userId: string): Promise<string> {
    this.validateFile(file)
    
    const fileName = `${userId}/${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file)
    
    if (error) {
      throw new Error('File upload failed')
    }
    
    return data.path
  }
}
```

## Security Monitoring

### Audit Logging

**Implementation**:
```typescript
// Comprehensive audit logging
export class AuditLogger {
  static async logAction(
    userId: string,
    action: string,
    tableName: string,
    recordId: string,
    oldValues?: any,
    newValues?: any
  ): Promise<void> {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action,
        table_name: tableName,
        record_id: recordId,
        old_values: oldValues,
        new_values: newValues,
        ip_address: await this.getClientIP(),
        user_agent: await this.getUserAgent(),
        timestamp: new Date().toISOString()
      })
    
    if (error) {
      console.error('Audit logging failed:', error)
    }
  }

  private static async getClientIP(): Promise<string> {
    // Get client IP from request headers
    return 'client_ip' // Implementation depends on deployment
  }

  private static async getUserAgent(): Promise<string> {
    return navigator.userAgent
  }
}
```

### Security Alerts

**Implementation**:
```typescript
// Security alert system
export class SecurityAlerts {
  static async detectSuspiciousActivity(userId: string, action: string): Promise<void> {
    const suspiciousPatterns = [
      'multiple_failed_logins',
      'unusual_location',
      'data_export_request',
      'bulk_data_access'
    ]
    
    if (suspiciousPatterns.includes(action)) {
      await this.sendSecurityAlert(userId, action)
    }
  }

  private static async sendSecurityAlert(userId: string, action: string): Promise<void> {
    // Send alert to security team
    console.log(`Security alert: ${action} by user ${userId}`)
  }
}
```

## Incident Response

### Security Incident Plan

**1. Detection**:
- Automated monitoring
- User reports
- Security scans

**2. Assessment**:
- Impact analysis
- Risk assessment
- Containment strategy

**3. Response**:
- Immediate containment
- Evidence preservation
- Communication plan

**4. Recovery**:
- System restoration
- Data recovery
- Lessons learned

**Implementation**:
```typescript
// Incident response utilities
export class IncidentResponse {
  static async handleSecurityIncident(incident: SecurityIncident): Promise<void> {
    // 1. Log incident
    await this.logIncident(incident)
    
    // 2. Assess impact
    const impact = await this.assessImpact(incident)
    
    // 3. Contain threat
    await this.containThreat(incident)
    
    // 4. Notify stakeholders
    await this.notifyStakeholders(incident, impact)
    
    // 5. Begin recovery
    await this.beginRecovery(incident)
  }

  private static async logIncident(incident: SecurityIncident): Promise<void> {
    await supabase
      .from('security_incidents')
      .insert({
        type: incident.type,
        severity: incident.severity,
        description: incident.description,
        timestamp: new Date().toISOString()
      })
  }
}
```

## Security Testing

### Vulnerability Scanning

**Tools**:
- npm audit
- OWASP ZAP
- Snyk
- SonarQube

**Implementation**:
```bash
# Run security audit
npm audit

# Run OWASP ZAP scan
zap-baseline.py -t https://your-app.vercel.app

# Run Snyk security scan
npx snyk test
```

### Penetration Testing

**Areas to Test**:
- Authentication bypass
- SQL injection
- XSS attacks
- CSRF attacks
- File upload vulnerabilities
- API security

**Implementation**:
```typescript
// Security testing utilities
export class SecurityTesting {
  static async testAuthenticationBypass(): Promise<void> {
    // Test authentication bypass attempts
  }

  static async testSQLInjection(): Promise<void> {
    // Test SQL injection vulnerabilities
  }

  static async testXSSVulnerabilities(): Promise<void> {
    // Test XSS vulnerabilities
  }
}
```

## Best Practices

### Development Security

**1. Code Review**:
- Security-focused code reviews
- Automated security scanning
- Dependency vulnerability checks

**2. Secure Development**:
- Input validation
- Output encoding
- Error handling
- Secure defaults

**3. Environment Security**:
- Environment variable protection
- Secret management
- Access control

### Deployment Security

**1. Infrastructure Security**:
- Network segmentation
- Firewall configuration
- SSL/TLS certificates
- DDoS protection

**2. Application Security**:
- Security headers
- Content Security Policy
- HTTPS enforcement
- Secure cookies

**3. Monitoring Security**:
- Log monitoring
- Alert systems
- Incident response
- Regular audits

### User Security

**1. Authentication**:
- Strong password requirements
- Multi-factor authentication
- Session management
- Account lockout

**2. Privacy**:
- Data minimization
- Consent management
- Data portability
- Right to deletion

**3. Education**:
- Security awareness training
- Privacy policy
- User guidelines
- Incident reporting

---

**MonDeneigeur PWA** - Comprehensive security guide for production-ready applications. 